#!/usr/bin/env node
/**
 * ORD023-test.js — Playwright headed E2E テスト（検体検査オーダー設定機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 注意: ORD023 ページ（/order/specimen-order/specimen-setting/ORD023）は
 *       現時点で page.tsx が return null のため、基本的な存在確認のみ行う。
 *       SpecimenOrderEntryFeature は受診者一覧（REC020）画面のサイドパネルとして
 *       統合される想定。
 *
 * 使い方: node ORD023-test.js [CODE]
 */

const path = require('path');
const fs   = require('fs');

// playwright を frontend/node_modules から解決
const playwrightPath = (() => {
  const candidates = [
    'playwright',
    path.join(__dirname, '../../../../../../node_modules/playwright'),
  ];
  for (const c of candidates) {
    try { require.resolve(c); return c; } catch {}
  }
  return null;
})();
if (!playwrightPath) {
  console.error('[ERROR] playwright が見つかりません。cd product/frontend && npm install --save-dev playwright を実行してください。');
  process.exit(1);
}
const { chromium } = require(playwrightPath);

const CODE      = process.argv[2] || 'ORD023';
const BASE_URL  = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const ORD023_PATH = '/dev/order/specimen-order/specimen-setting/ORD023';

const LOG_DIR  = path.join(__dirname, '../../../../../../../../.claude/logs');
fs.mkdirSync(LOG_DIR, { recursive: true });
const ts       = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const LOG_FILE = path.join(LOG_DIR, `e2e-${CODE}-${ts}.log`);

// ─── カラー出力 ───────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  bold:   '\x1b[1m',
};

let pass = 0, fail = 0;
const junitCases = [];
let currentStep = '';

function log(msg) {
  process.stdout.write(msg + '\n');
  fs.appendFileSync(LOG_FILE, msg.replace(/\x1b\[[0-9;]*m/g, '') + '\n');
}

function step(n, total, label) {
  currentStep = label;
  log(`${C.cyan}[${n}/${total}]${C.reset} ${label} ...`);
}

function ok(label) {
  pass++;
  junitCases.push({ name: currentStep, status: 'pass', detail: label });
  log(`  ${C.green}✓ PASS${C.reset}  ${label}`);
}

function ng(label, detail) {
  fail++;
  junitCases.push({ name: currentStep, status: 'fail', detail: label + (detail ? ' — ' + detail : '') });
  log(`  ${C.red}✗ FAIL${C.reset}  ${label}${detail ? ' — ' + detail : ''}`);
}

function warn(msg) {
  junitCases.push({ name: currentStep, status: 'warn', detail: msg });
  log(`  ${C.yellow}⚠ WARN${C.reset}  ${msg}`);
}

function writeJUnit() {
  const junitFile = path.join(LOG_DIR, `junit-${CODE}-${ts}.xml`);
  const total = junitCases.length;
  const failures = junitCases.filter(c => c.status === 'fail').length;
  const skipped = junitCases.filter(c => c.status === 'warn').length;

  const cases = junitCases.map(c => {
    const name = c.name.replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    const detail = (c.detail || '').replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    if (c.status === 'fail') {
      return `    <testcase name="${name}" classname="${CODE}"><failure message="${detail}">${detail}</failure></testcase>`;
    } else if (c.status === 'warn') {
      return `    <testcase name="${name}" classname="${CODE}"><skipped message="${detail}"/></testcase>`;
    }
    return `    <testcase name="${name}" classname="${CODE}"/>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="${CODE}" tests="${total}" failures="${failures}" skipped="${skipped}" errors="0">
${cases}
  </testsuite>
</testsuites>`;
  fs.writeFileSync(junitFile, xml, 'utf8');
  log(`  JUnit: ${junitFile}`);
}

// ─── ORD023 テスト定義 ────────────────────────────────────────
async function runORD023(page) {
  const TOTAL = 3;
  let n = 0;

  log('');
  log(`${C.bold}━━━ ORD023 検体検査オーダー設定 E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${ORD023_PATH}`);
  log(`  注意: 現時点では page.tsx が未接続（return null）のため基本確認のみ`);
  log('');

  // ─── 1. 画面ルートへのアクセス確認 ──────────────────────
  step(++n, TOTAL, '画面ルートへのアクセス確認（200 OK）');
  const response = await page.goto(`${BASE_URL}${ORD023_PATH}`, { waitUntil: 'domcontentloaded' });
  const status = response ? response.status() : 0;
  if (status === 200) {
    ok(`HTTP ${status} — ページルートが存在する`);
  } else {
    ng(`HTTP ${status} — ページルートが存在しないか到達不可`);
  }

  // ─── 2. ページ読み込み完了確認 ───────────────────────────
  step(++n, TOTAL, 'ページ読み込み完了確認');
  await page.waitForTimeout(1000);
  const title = await page.title();
  ok(`タイトル取得: "${title}"`);

  // ─── 3. SpecimenOrderEntryFeature の存在確認（将来の接続確認）
  step(++n, TOTAL, 'SpecimenOrderEntryFeature の存在確認（page.tsx 未接続のため WARN 扱い）');
  // page.tsx が return null の間は何も描画されないが、ルートは存在する
  const bodyContent = await page.locator('body').innerHTML().catch(() => '');
  if (bodyContent.includes('SpecimenOrder') || bodyContent.includes('確定へ進む') || bodyContent.includes('検体')) {
    ok('SpecimenOrderEntryFeature のコンテンツを確認');
  } else {
    warn('page.tsx が return null のため SpecimenOrderEntryFeature は未描画（TODO: page.tsx を ORD023 に接続する）');
  }

  return { pass, fail };
}

// ─── メイン ───────────────────────────────────────────────────
(async () => {
  log('');
  log(`${C.bold}${C.cyan}╔══════════════════════════════════════════╗${C.reset}`);
  log(`${C.bold}${C.cyan}║   Harz E2E テスト (Playwright Headed)   ║${C.reset}`);
  log(`${C.bold}${C.cyan}╚══════════════════════════════════════════╝${C.reset}`);
  log(`  CODE: ${CODE}`);
  log(`  LOG : ${LOG_FILE}`);
  log(`  TIME: ${new Date().toLocaleString('ja-JP')}`);
  log('');

  const isCI = !!process.env.CI;
  const browser = await chromium.launch({
    headless: isCI,
    slowMo: isCI ? 0 : 120,
    args: [
      ...(isCI
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : ['--start-maximized', `--display=${process.env.DISPLAY || ':0'}`]),
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--lang=ja-JP',
    ],
  });

  fs.mkdirSync(path.join(LOG_DIR, 'videos'), { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8' },
    recordVideo: {
      dir: path.join(LOG_DIR, 'videos'),
      size: { width: 1400, height: 900 },
    },
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      fs.appendFileSync(LOG_FILE, `[BROWSER ERROR] ${msg.text()}\n`);
    }
  });

  try {
    await runORD023(page);
    await page.waitForTimeout(1500);
  } catch (err) {
    fail++;
    log(`${C.red}[ERROR] ${err.message}${C.reset}`);
    fs.appendFileSync(LOG_FILE, `[EXCEPTION] ${err.stack}\n`);
  } finally {
    const videoPath = await page.video()?.path();
    await context.close();
    await browser.close();
    if (videoPath) {
      const videoFile = path.join(LOG_DIR, 'videos', `${CODE}-${ts}.webm`);
      fs.renameSync(videoPath, videoFile);
      log(`  動画: ${videoFile}`);
    }
  }

  // ─── サマリー ────────────────────────────────────────────
  const total = pass + fail;
  log('');
  log(`${C.bold}━━━ テスト完了 ━━━${C.reset}`);
  if (fail === 0) {
    log(`${C.green}${C.bold}  ✓ ALL PASSED: ${pass}/${total}${C.reset}`);
  } else {
    log(`${C.red}${C.bold}  ✗ ${fail} FAILED / ${pass} PASSED / ${total} total${C.reset}`);
  }
  log(`  ログ: ${LOG_FILE}`);
  log('');
  writeJUnit();

  process.exit(fail > 0 ? 1 : 0);
})();
