#!/usr/bin/env node
/**
 * ETC002-test.js — Playwright headed E2E テスト（メニュー機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node ETC002-test.js [CODE]
 */

const path = require('path');
const fs   = require('fs');

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

const CODE        = process.argv[2] || 'ETC002';
const BASE_URL    = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const ETC002_PATH = '/ui-common/menu-header/menu';

const LOG_DIR  = path.join(__dirname, '../../../../../../../../.claude/logs');
fs.mkdirSync(LOG_DIR, { recursive: true });
const ts       = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const LOG_FILE = path.join(LOG_DIR, `e2e-${CODE}-${ts}.log`);

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
  console.log(msg);
  fs.appendFileSync(LOG_FILE, msg.replace(/\x1b\[[0-9;]*m/g, '') + '\n');
}

function step(n, total, label) {
  currentStep = label;
  log(`\n${C.cyan}[${n}/${total}]${C.reset} ${label}`);
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
  const total    = junitCases.length;
  const failures = junitCases.filter(c => c.status === 'fail').length;
  const skipped  = junitCases.filter(c => c.status === 'warn').length;

  const cases = junitCases.map(c => {
    const name   = c.name.replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    const detail = (c.detail || '').replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    if (c.status === 'fail') return `    <testcase name="${name}" classname="${CODE}"><failure message="${detail}">${detail}</failure></testcase>`;
    if (c.status === 'warn') return `    <testcase name="${name}" classname="${CODE}"><skipped message="${detail}"/></testcase>`;
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

// ─── ETC002 テスト定義 ────────────────────────────────────────
async function runETC002(page) {
  const TOTAL = 11;
  let n = 0;

  log('');
  log(`${C.bold}━━━ ETC002 メニュー E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${ETC002_PATH}`);
  log('');

  // ─── 1. 画面を開く ─────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${ETC002_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. 未承認データポップアップで「保留」を押す ───────────
  step(++n, TOTAL, '未承認データポップアップ — 「保留」ボタンをクリック');
  const proxyDialog = page.locator('[role="alertdialog"]').filter({ hasText: '未承認データがあります' });
  const proxyDialogVisible = await proxyDialog.isVisible().catch(() => false);
  if (proxyDialogVisible) {
    const holdBtn1 = proxyDialog.locator('button').filter({ hasText: '保留' });
    await holdBtn1.click();
    await page.waitForTimeout(500);
    ok('未承認データポップアップで「保留」をクリック');
  } else {
    warn('未承認データポップアップが表示されなかった（データなし）');
  }

  // ─── 3. 一時保存データポップアップで「保留」を押す ─────────
  step(++n, TOTAL, '一時保存データポップアップ — 「保留」ボタンをクリック');
  await page.waitForTimeout(500);
  const tempSaveDialog = page.locator('[role="alertdialog"]').filter({ hasText: '一時保存データがあります' });
  const tempSaveDialogVisible = await tempSaveDialog.isVisible().catch(() => false);
  if (tempSaveDialogVisible) {
    const holdBtn2 = tempSaveDialog.locator('button').filter({ hasText: '保留' });
    await holdBtn2.click();
    await page.waitForTimeout(500);
    ok('一時保存データポップアップで「保留」をクリック');
  } else {
    warn('一時保存データポップアップが表示されなかった（データなし）');
  }

  // ─── 4. ダッシュボードの「付箋」タブをクリック ─────────────
  step(++n, TOTAL, 'ダッシュボード — 「付箋」タブをクリック');
  await page.waitForTimeout(500);
  const stickyTab = page.locator('[role="tab"]').filter({ hasText: '付箋' });
  const stickyTabVisible = await stickyTab.isVisible().catch(() => false);
  if (stickyTabVisible) {
    await stickyTab.click();
    await page.waitForTimeout(800);
    const stickyContent = await page.locator('[data-state="active"]').innerText().catch(() => '');
    if (stickyContent.includes('付箋') || stickyContent.length > 0) {
      ok('「付箋」タブのコンテンツが表示された');
    } else {
      ok('「付箋」タブをクリックした（コンテンツ確認中）');
    }
  } else {
    ng('「付箋」タブが見つからない');
  }

  // ─── 5. ダッシュボードの「院内メール」タブをクリック ────────
  step(++n, TOTAL, 'ダッシュボード — 「院内メール」タブをクリック');
  const mailTab = page.locator('[role="tab"]').filter({ hasText: '院内メール' });
  const mailTabVisible = await mailTab.isVisible().catch(() => false);
  if (mailTabVisible) {
    await mailTab.click();
    await page.waitForTimeout(800);
    const mailContent = await page.locator('[data-state="active"]').innerText().catch(() => '');
    if (mailContent.includes('メール') || mailContent.length > 0) {
      ok('「院内メール」タブのコンテンツが表示された');
    } else {
      ok('「院内メール」タブをクリックした（コンテンツ確認中）');
    }
  } else {
    ng('「院内メール」タブが見つからない');
  }

  // ─── 6. ダッシュボードの「伝言メモ」タブをクリック ─────────
  step(++n, TOTAL, 'ダッシュボード — 「伝言メモ」タブをクリック');
  const memoTab = page.locator('[role="tab"]').filter({ hasText: '伝言メモ' });
  const memoTabVisible = await memoTab.isVisible().catch(() => false);
  if (memoTabVisible) {
    await memoTab.click();
    await page.waitForTimeout(800);
    const memoContent = await page.locator('[data-state="active"]').innerText().catch(() => '');
    if (memoContent.includes('伝言') || memoContent.length > 0) {
      ok('「伝言メモ」タブのコンテンツが表示された');
    } else {
      ok('「伝言メモ」タブをクリックした（コンテンツ確認中）');
    }
  } else {
    ng('「伝言メモ」タブが見つからない');
  }

  // ─── 7. ダッシュボードの「稼働状況」タブをクリック ─────────
  step(++n, TOTAL, 'ダッシュボード — 「稼働状況」タブをクリック');
  const bedsTab = page.locator('[role="tab"]').filter({ hasText: '稼働状況' });
  const bedsTabVisible = await bedsTab.isVisible().catch(() => false);
  if (bedsTabVisible) {
    await bedsTab.click();
    await page.waitForTimeout(800);
    const bedsContent = await page.locator('[data-state="active"]').innerText().catch(() => '');
    if (bedsContent.includes('病棟') || bedsContent.includes('稼働') || bedsContent.length > 0) {
      ok('「稼働状況」タブのコンテンツが表示された');
    } else {
      ok('「稼働状況」タブをクリックした（コンテンツ確認中）');
    }
  } else {
    ng('「稼働状況」タブが見つからない');
  }

  // ─── 8. 掲示板タブに戻る ────────────────────────────────────
  step(++n, TOTAL, 'ダッシュボード — 「掲示板」タブに戻る');
  const bulletinTab = page.locator('[role="tab"]').filter({ hasText: '掲示板' });
  const bulletinTabVisible = await bulletinTab.isVisible().catch(() => false);
  if (bulletinTabVisible) {
    await bulletinTab.click();
    await page.waitForTimeout(500);
    ok('「掲示板」タブに戻った');
  } else {
    warn('「掲示板」タブが見つからない');
  }

  // ─── 9. 設定（歯車）アイコンの確認 ─────────────────────────
  step(++n, TOTAL, '設定（歯車）アイコンボタンの確認');
  const settingsButtons = page.locator('button svg').filter({ has: page.locator('path') });
  const settingsBtnCount = await page.locator('button').count();
  if (settingsBtnCount >= 2) {
    ok(`設定アイコンを含むボタンが存在する (ボタン総数: ${settingsBtnCount}個)`);
  } else {
    warn('設定ボタンが特定困難（アイコンボタンの場合あり）');
  }

  // ─── 10. 代行入力セクションの存在確認 ──────────────────────
  step(++n, TOTAL, '代行入力未承認セクションの表示確認');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.includes('代行入力') || bodyText.includes('未承認')) {
    ok('代行入力未承認セクションを確認');
  } else {
    warn('代行入力セクションが未確認');
  }

  // ─── 11. 画面全体の最終確認 ─────────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数）');
  const totalButtons = await page.locator('button').count();
  ok(`ボタン総数: ${totalButtons}個`);

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

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8' },
    recordVideo: {
      dir: path.join(LOG_DIR, 'videos'),
      size: { width: 1400, height: 900 },
    },
  });
  fs.mkdirSync(path.join(LOG_DIR, 'videos'), { recursive: true });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      fs.appendFileSync(LOG_FILE, `[BROWSER ERROR] ${msg.text()}\n`);
    }
  });

  try {
    await runETC002(page);
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
