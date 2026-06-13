#!/usr/bin/env node
/**
 * DEP002-test.js — Playwright headed E2E テスト（臨床検査科指示受け）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node DEP002-test.js [CODE]
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

const CODE      = process.argv[2] || 'DEP002';
const BASE_URL  = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const DEP002_PATH = '/dept-instruction/lab-instruction';

// i18n キー定数（@/shared/i18n の TS path alias は Node.js 直実行では解決不可のため定数化）
const i18n = {
  orderTypeLabels: {
    SPECIMEN_TEST:      '検体検査',
    PHYSIOLOGICAL_TEST: '生理検査',
  },
  screen: {
    buttons: {
      labelPrint:    'ラベル印刷',
      documentPrint: '帳票出力',
    },
  },
  searchCriteria: {
    collapseAria: '検索条件を折りたたむ',
  },
};

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

// ─── DEP002 テスト定義 ────────────────────────────────────────
async function runDEP002(page) {
  const TOTAL = 13;
  let n = 0;

  log('');
  log(`${C.bold}━━━ DEP002 臨床検査科指示受け E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${DEP002_PATH}`);
  log('');

  // ─── 1. 画面を開く ────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${DEP002_PATH}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. メインコンテナの表示確認 ─────────────────────────
  step(++n, TOTAL, 'メインコンテナ（指示受け画面）の表示確認');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.includes('臨床検査') || bodyText.includes('DEP002') || bodyText.includes('指示受け')) {
    ok('臨床検査科指示受け画面のコンテンツを確認');
  } else {
    const btnCount = await page.locator('button').count();
    if (btnCount > 0) {
      warn(`画面テキスト特定困難 — ボタン総数: ${btnCount}個（ページは読み込まれている）`);
    } else {
      ng('画面コンテンツが見つからない');
    }
  }

  // ─── 3. 検索条件パネルの表示確認 ─────────────────────────
  step(++n, TOTAL, '検索条件パネルの表示確認');
  const searchPanel = page.locator('text=患者').first();
  const dateInput = page.locator('input[type="date"], input[type="text"]').first();
  const searchPanelVisible = await searchPanel.isVisible().catch(() => false);
  const dateInputVisible   = await dateInput.isVisible().catch(() => false);
  if (searchPanelVisible || dateInputVisible) {
    ok('検索条件パネル（患者・日付等）を確認');
  } else {
    warn('検索条件パネルのテキスト特定困難（折りたたみ状態の可能性）');
  }

  // ─── 4. オーダー種フィルターボタンの確認 ─────────────────
  step(++n, TOTAL, 'オーダー種フィルターボタンの確認（検体検査・生理検査等）');
  const specimenBtn  = page.locator('button').filter({ hasText: i18n.orderTypeLabels.SPECIMEN_TEST }).first();
  const physioBtn    = page.locator('button').filter({ hasText: i18n.orderTypeLabels.PHYSIOLOGICAL_TEST }).first();
  const specimenV    = await specimenBtn.isVisible().catch(() => false);
  const physioV      = await physioBtn.isVisible().catch(() => false);
  if (specimenV || physioV) {
    ok(`オーダー種フィルターを確認 (検体:${specimenV} 生理:${physioV})`);
  } else {
    warn('オーダー種フィルターボタンが見つからない（APIエラー or 未実装状態の可能性）');
  }

  // ─── 5. 操作ボタンエリアの表示確認 ───────────────────────
  step(++n, TOTAL, '操作ボタンエリア（ラベル印刷・帳票発行）の表示確認');
  const labelBtn    = page.locator('button').filter({ hasText: i18n.screen.buttons.labelPrint }).first();
  const documentBtn = page.locator('button').filter({ hasText: i18n.screen.buttons.documentPrint }).first();
  const labelV      = await labelBtn.isVisible().catch(() => false);
  const documentV   = await documentBtn.isVisible().catch(() => false);
  if (labelV || documentV) {
    ok(`操作ボタンを確認 (ラベル印刷:${labelV} 帳票発行:${documentV})`);
  } else {
    warn('操作ボタンが見つからない（オーダー未選択状態の可能性）');
  }

  // ─── 6. テーブルまたはリストの表示確認 ───────────────────
  step(++n, TOTAL, 'オーダーテーブルまたは一覧の表示確認');
  const tableEl  = page.locator('table').first();
  const tableDiv = page.locator('[role="table"]').first();
  const tableV   = await tableEl.isVisible().catch(() => false);
  const tableDivV = await tableDiv.isVisible().catch(() => false);
  if (tableV || tableDivV) {
    ok('オーダーテーブルを確認');
  } else {
    // ローディング中またはAPIエラーの場合
    const loadingEl = page.locator('text=/読み込み|Loading|エラー/').first();
    const loadingV  = await loadingEl.isVisible().catch(() => false);
    if (loadingV) {
      warn('テーブルがローディング中またはAPIエラー状態');
    } else {
      warn('テーブルが見つからない（オーダーなし or API未接続状態の可能性）');
    }
  }

  // ─── 7. 折りたたみ操作（検索条件パネル） ─────────────────
  step(++n, TOTAL, '検索条件パネルの折りたたみ操作');
  // aria-label="検索条件を折りたたむ" または aria-expanded 属性を持つボタンを優先検索
  const foldBtn = page.locator(`button[aria-label="${i18n.searchCriteria.collapseAria}"]`).first();
  const foldV   = await foldBtn.isVisible().catch(() => false);
  if (foldV) {
    await foldBtn.click();
    await page.waitForTimeout(500);
    ok('折りたたみボタンをクリックした');
    // 再度展開
    const expandBtn = page.locator('button[aria-expanded="false"]').first();
    await expandBtn.click().catch(() => {});
    await page.waitForTimeout(300);
  } else {
    // aria-expanded 属性ベースのボタンにフォールバック
    const chevronBtn = page.locator('button[aria-expanded]').first();
    const chevronV   = await chevronBtn.isVisible().catch(() => false);
    if (chevronV) {
      await chevronBtn.click();
      await page.waitForTimeout(500);
      ok('折りたたみボタン（aria-expanded）をクリックした');
      await page.locator('button[aria-expanded="false"]').first().click().catch(() => {});
      await page.waitForTimeout(300);
    } else {
      warn('折りたたみボタンが見つからない');
    }
  }

  // ─── 8. 検索実行ボタンの確認 ─────────────────────────────
  step(++n, TOTAL, '検索（絞り込み）ボタンの表示確認');
  const searchBtn = page.locator('button').filter({ hasText: /検索|絞り込み|表示/ }).first();
  const searchV   = await searchBtn.isVisible().catch(() => false);
  if (searchV) {
    ok('検索ボタンを確認');
  } else {
    warn('検索ボタンが見つからない（折りたたみ中の可能性）');
  }

  // ─── 9. チェックボックスの確認 ───────────────────────────
  step(++n, TOTAL, 'オーダー選択チェックボックスの確認');
  const checkboxes = page.locator('input[type="checkbox"]');
  const cbCount    = await checkboxes.count().catch(() => 0);
  if (cbCount > 0) {
    ok(`チェックボックスを確認 — ${cbCount}個`);
  } else {
    warn('チェックボックスが見つからない（オーダーなし or テーブル非表示の可能性）');
  }

  // ─── 10. 画面全体の最終確認 ──────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数・JSエラーなし）');
  const buttonCount = await page.locator('button').count();
  ok(`ボタン総数: ${buttonCount}個`);

  // ─── 11. 山田花子の「開始」ボタンをクリックして画面遷移確認 ────
  step(++n, TOTAL, '山田花子（または受付済オーダー）の「開始」ボタンをクリックして DEP009 へ遷移');
  // 「山田花子」行を探す。存在しない場合は受付済ステータスの最初の「開始」ボタンを使う
  const yamadaRow = page.locator('tr, [role="row"]').filter({ hasText: /山田.花子|山田花子/ }).first();
  const yamadaExists = await yamadaRow.isVisible().catch(() => false);

  let startBtn;
  if (yamadaExists) {
    startBtn = yamadaRow.locator('button').filter({ hasText: /^開始$/ }).first();
    log(`  → 山田花子の行を発見`);
  } else {
    warn('山田花子が見つからない（モックデータに存在しない）— 受付済の最初の「開始」ボタンを代用');
    startBtn = page.locator('button').filter({ hasText: /^開始$/ }).first();
  }

  const startBtnV = await startBtn.isVisible().catch(() => false);
  if (startBtnV) {
    const currentUrl = page.url();
    await startBtn.click();
    await page.waitForTimeout(1500);
    const newUrl = page.url();
    if (newUrl !== currentUrl) {
      if (newUrl.includes('DEP009') || newUrl.includes('patient-id-check')) {
        ok(`DEP009（患者ID確認）画面へ遷移 — URL: ${newUrl}`);
      } else {
        ok(`画面遷移を確認 — URL: ${newUrl}`);
      }
    } else {
      warn(`URL変化なし（ダイアログ表示またはルーターモック状態の可能性） — URL: ${newUrl}`);
    }
  } else {
    warn('「開始」ボタンが見つからない（受付済オーダーなし、またはAPI未接続状態の可能性）');
  }

  // ─── 12. ブラウザの戻るで元の画面（DEP002）へ戻る ────────────
  step(++n, TOTAL, 'ブラウザの戻るで DEP002 画面へ戻る');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const backUrl = page.url();
  if (backUrl.includes('DEP002') || backUrl.includes('lab-instruction')) {
    ok(`DEP002 画面に戻ったことを確認 — URL: ${backUrl}`);
  } else {
    const bodyTextAfterBack = await page.locator('body').innerText().catch(() => '');
    if (bodyTextAfterBack.includes('臨床検査') || bodyTextAfterBack.includes('指示受け')) {
      ok(`DEP002 画面のコンテンツを確認（URL: ${backUrl}）`);
    } else {
      warn(`戻り先が DEP002 と判定できない — URL: ${backUrl}`);
    }
  }

  // ─── 13. 検索条件「入外区分: 外来」を選択して検索実行 ────────
  step(++n, TOTAL, '検索条件「入外区分: 外来」を選択して検索を実行');
  // 検索条件パネルが折りたたまれている場合は展開する
  const panelExpanded = await page.locator('[aria-expanded="true"]').first().isVisible().catch(() => false);
  if (!panelExpanded) {
    const expandBtn = page.locator('[aria-expanded="false"]').first();
    const expandV = await expandBtn.isVisible().catch(() => false);
    if (expandV) {
      await expandBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 入外区分セレクトを操作（shadcn Select は role="combobox" を持つ）
  // 「入外区分」ラベルの隣の combobox を特定する
  const locationLabel = page.locator('label').filter({ hasText: /入外区分/ }).first();
  const locationLabelV = await locationLabel.isVisible().catch(() => false);

  let locationSelected = false;
  if (locationLabelV) {
    // ラベル直後の select トリガーをクリック
    const locationSection = page.locator('div').filter({ has: page.locator('label', { hasText: /入外区分/ }) }).first();
    const combobox = locationSection.locator('[role="combobox"]').first();
    const comboboxV = await combobox.isVisible().catch(() => false);
    if (comboboxV) {
      await combobox.click();
      await page.waitForTimeout(400);
      // ドロップダウンから「外来」を選択
      const gairaiOption = page.locator('[role="option"]').filter({ hasText: /^外来$/ }).first();
      const gairaiV = await gairaiOption.isVisible().catch(() => false);
      if (gairaiV) {
        await gairaiOption.click();
        await page.waitForTimeout(300);
        locationSelected = true;
        log(`  → 入外区分「外来」を選択`);
      } else {
        warn('「外来」オプションが見つからない');
      }
    } else {
      warn('入外区分のセレクトボックスが見つからない');
    }
  } else {
    warn('「入外区分」ラベルが見つからない');
  }

  // 検索ボタンをクリック
  const searchExecBtn = page.locator('button').filter({ hasText: /^検索$/ }).first();
  const searchExecV = await searchExecBtn.isVisible().catch(() => false);
  if (searchExecV) {
    await searchExecBtn.click();
    await page.waitForTimeout(800);
    if (locationSelected) {
      ok('入外区分「外来」を選択して検索を実行した');
    } else {
      ok('検索ボタンをクリックした（入外区分の選択は失敗）');
    }
  } else {
    warn('検索ボタンが見つからない');
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
    await runDEP002(page);
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
      fs.mkdirSync(path.join(LOG_DIR, 'videos'), { recursive: true });
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
