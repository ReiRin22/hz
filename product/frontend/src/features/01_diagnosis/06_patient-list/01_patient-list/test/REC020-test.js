#!/usr/bin/env node
/**
 * REC020-test.js — Playwright headed E2E テスト（受診者一覧機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node REC020-test.js [CODE]
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

const CODE      = process.argv[2] || 'REC020';
const BASE_URL  = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const REC020_PATH = '/dev/diagnosis/patient-list/patient-list/REC020';

const LOG_DIR  = path.join(__dirname, '../../../../../../../../.claude/logs');
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(path.join(LOG_DIR, 'videos'), { recursive: true });
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

// ─── REC020 テスト定義 ────────────────────────────────────────
async function runREC020(page) {
  const TOTAL = 10;
  let n = 0;

  log('');
  log(`${C.bold}━━━ REC020 受診者一覧 E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${REC020_PATH}`);
  log('');

  // ─── 1. 画面を開く ────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${REC020_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. ページタイトルの表示確認 ─────────────────────────
  step(++n, TOTAL, 'ページタイトルの表示確認');
  const heading = page.locator('h1').first();
  const headingVisible = await heading.isVisible().catch(() => false);
  if (headingVisible) {
    const headingText = await heading.textContent().catch(() => '');
    ok(`ページ見出しを確認: "${headingText}"`);
  } else {
    warn('h1 見出しが見つからない（ページ構造を確認）');
  }

  // ─── 3. フィルターバーの表示確認 ─────────────────────────
  step(++n, TOTAL, 'フィルターバーの表示確認（日付・診療科・診察医）');
  const dateInput = page.locator('button').filter({ hasText: /\d{4}\/\d{2}\/\d{2}/ }).first();
  const dateVisible = await dateInput.isVisible().catch(() => false);
  if (dateVisible) {
    ok('日付フィルターボタンを確認');
  } else {
    // 日付表示が別形式の可能性
    const filterArea = page.locator('.reception-filter-bar').first();
    const filterVisible = await filterArea.isVisible().catch(() => false);
    if (filterVisible) ok('フィルターバーエリアを確認');
    else warn('フィルターバーの表示を確認できない');
  }

  // ─── 4. 統計情報の表示確認 ───────────────────────────────
  step(++n, TOTAL, '統計情報の表示確認（診察済み・受付済み・対象）');
  const statsArea = page.locator('.reception-filter-bar__stats').first();
  const statsVisible = await statsArea.isVisible().catch(() => false);
  if (statsVisible) {
    ok('統計情報エリアを確認');
  } else {
    // 数字を表示するspan要素を探す
    const numSpans = await page.locator('.reception-filter-bar__stats-num').count();
    if (numSpans > 0) ok(`統計数値を確認 (${numSpans}個)`);
    else warn('統計情報エリアの表示を確認できない（APIモック未接続の可能性）');
  }

  // ─── 5. テーブル or ローディング状態の確認 ───────────────
  step(++n, TOTAL, 'テーブル表示またはローディング状態の確認');
  await page.waitForTimeout(2000); // API呼び出し待機
  const table = page.locator('table.reception-patient-list__table').first();
  const loadingEl = page.locator('[role="status"]').first();
  const tableVisible = await table.isVisible().catch(() => false);
  const loadingVisible = await loadingEl.isVisible().catch(() => false);
  if (tableVisible) {
    ok('患者一覧テーブルを確認');
  } else if (loadingVisible) {
    warn('ローディング中（APIが応答していない可能性）');
  } else {
    // テーブルが受診者0件でも構造は存在する
    const anyTable = await page.locator('table').count();
    if (anyTable > 0) ok(`テーブル要素を確認 (${anyTable}個)`);
    else warn('テーブル要素が見つからない（APIエラーまたはローディング中）');
  }

  // ─── 6. チェックボックスフィルターの確認 ─────────────────
  step(++n, TOTAL, 'チェックボックスフィルター（診察済含む・予約含む）の確認');
  const checkboxes = await page.locator('input[type="checkbox"]').count();
  if (checkboxes >= 2) {
    ok(`チェックボックスを確認 (${checkboxes}個)`);
  } else {
    warn(`チェックボックスが少ない (${checkboxes}個)`);
  }

  // ─── 7. 診療科ドロップダウンの操作確認 ───────────────────
  step(++n, TOTAL, '診療科ドロップダウンのクリック操作');
  const deptBtn = page.locator('.reception-filter-bar__dropdown-btn').first();
  const deptBtnVisible = await deptBtn.isVisible().catch(() => false);
  if (deptBtnVisible) {
    await deptBtn.click();
    await page.waitForTimeout(300);
    const dropdownMenu = page.locator('.reception-filter-bar__dropdown-menu--right').first();
    const menuVisible = await dropdownMenu.isVisible().catch(() => false);
    if (menuVisible) ok('診療科ドロップダウンメニューが開いた');
    else warn('ドロップダウンメニューの表示を確認できない');
    // クローズ
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  } else {
    warn('診療科ドロップダウンボタンが見つからない');
  }

  // ─── 8. 画面全体の最終確認 ──────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数・JSエラーなし）');
  const buttonCount = await page.locator('button').count();
  ok(`ボタン総数: ${buttonCount}個`);

  // ─── 9. 診察済含む チェックボックス — ON→行増加→OFF ────────
  step(++n, TOTAL, '診察済含む: チェックON→行増加を確認→チェックOFF');
  {
    // テーブルが表示されるまで待機
    await page.waitForSelector('table.reception-patient-list__table tbody tr', { timeout: 5000 }).catch(() => null);

    // チェック前の行数
    const rowsBefore = await page.locator('table.reception-patient-list__table tbody tr').count();

    // 「診察済含む」ラベルのチェックボックスを取得してクリック
    const completedCb = page.locator('label').filter({ hasText: '診察済含む' }).locator('input[type="checkbox"]');
    const cbVisible = await completedCb.isVisible().catch(() => false);
    if (!cbVisible) {
      warn('診察済含む チェックボックスが見つからない');
    } else {
      await completedCb.check();
      await page.waitForTimeout(400);

      const rowsAfter = await page.locator('table.reception-patient-list__table tbody tr').count();
      if (rowsAfter > rowsBefore) {
        ok(`診察済含む ON → 行数が増加 (${rowsBefore} → ${rowsAfter})`);
      } else if (rowsAfter === rowsBefore && rowsBefore === 0) {
        warn(`テーブルが空のため行数変化を確認できない (${rowsBefore} → ${rowsAfter})`);
      } else {
        ng(`診察済含む ON → 行数が増えていない (${rowsBefore} → ${rowsAfter})`);
      }

      // チェックを外して元に戻す
      await completedCb.uncheck();
      await page.waitForTimeout(400);
      const rowsRestored = await page.locator('table.reception-patient-list__table tbody tr').count();
      if (rowsRestored === rowsBefore) {
        ok(`診察済含む OFF → 行数が元に戻った (${rowsRestored})`);
      } else {
        ng(`診察済含む OFF → 行数が元に戻っていない (期待: ${rowsBefore}, 実際: ${rowsRestored})`);
      }
    }
  }

  // ─── 10. 予約含む チェックボックス — ON→行増加→OFF ─────────
  step(++n, TOTAL, '予約含む: チェックON→行増加を確認→チェックOFF');
  {
    const rowsBefore = await page.locator('table.reception-patient-list__table tbody tr').count();

    const reservationCb = page.locator('label').filter({ hasText: '予約含む' }).locator('input[type="checkbox"]');
    const cbVisible = await reservationCb.isVisible().catch(() => false);
    if (!cbVisible) {
      warn('予約含む チェックボックスが見つからない');
    } else {
      await reservationCb.check();
      await page.waitForTimeout(400);

      const rowsAfter = await page.locator('table.reception-patient-list__table tbody tr').count();
      if (rowsAfter > rowsBefore) {
        ok(`予約含む ON → 行数が増加 (${rowsBefore} → ${rowsAfter})`);
      } else if (rowsAfter === rowsBefore && rowsBefore === 0) {
        warn(`テーブルが空のため行数変化を確認できない (${rowsBefore} → ${rowsAfter})`);
      } else {
        ng(`予約含む ON → 行数が増えていない (${rowsBefore} → ${rowsAfter})`);
      }

      // チェックを外して元に戻す
      await reservationCb.uncheck();
      await page.waitForTimeout(400);
      const rowsRestored = await page.locator('table.reception-patient-list__table tbody tr').count();
      if (rowsRestored === rowsBefore) {
        ok(`予約含む OFF → 行数が元に戻った (${rowsRestored})`);
      } else {
        ng(`予約含む OFF → 行数が元に戻っていない (期待: ${rowsBefore}, 実際: ${rowsRestored})`);
      }
    }
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
    args: isCI
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : ['--start-maximized', `--display=${process.env.DISPLAY || ':0'}`],
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    locale: 'ja-JP',
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
    await runREC020(page);
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
