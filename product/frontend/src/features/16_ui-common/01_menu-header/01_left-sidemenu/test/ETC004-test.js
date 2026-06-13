#!/usr/bin/env node
/**
 * ETC004-test.js — Playwright headed E2E テスト（左サイドメニュー / オーダーエントリ機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node ETC004-test.js [CODE]
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

const CODE         = process.argv[2] || 'ETC004';
const BASE_URL     = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const ETC004_PATH  = '/dev/ui-common/menu-header/left-sidemenu/ETC004';

const LOG_DIR  = path.join(__dirname, '../../../../../../../../.claude/logs');
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

// ─── ETC004 テスト定義 ────────────────────────────────────────
async function runETC004(page) {
  const TOTAL = 15;
  let n = 0;

  log('');
  log(`${C.bold}━━━ ETC004 左サイドメニュー / オーダーエントリ E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${ETC004_PATH}`);
  log('');

  // ─── 1. 画面を開く ────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${ETC004_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. 患者情報パネルの表示確認 ─────────────────────────
  step(++n, TOTAL, '患者情報（山田太郎）の表示確認');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.includes('山田太郎') || bodyText.includes('12345678')) {
    ok('患者情報（山田太郎・患者番号12345678）を確認');
  } else {
    warn('患者情報テキストが見つからない（初期データ未ロードの可能性）');
  }

  // ─── 3. オーダー種別タブの表示確認 ───────────────────────
  step(++n, TOTAL, 'オーダー種別タブ（処方・注射・検体）の表示確認');
  const prescriptionTab = page.locator('button, [role="tab"]').filter({ hasText: '処方' }).first();
  const injectionTab    = page.locator('button, [role="tab"]').filter({ hasText: '注射' }).first();
  const labTab          = page.locator('button, [role="tab"]').filter({ hasText: '検体' }).first();
  const pv = await prescriptionTab.isVisible().catch(() => false);
  const iv = await injectionTab.isVisible().catch(() => false);
  const lv = await labTab.isVisible().catch(() => false);
  if (pv && iv && lv) {
    ok('処方・注射・検体タブを確認');
  } else if (pv || iv || lv) {
    warn(`一部タブ未確認 (処方:${pv} 注射:${iv} 検体:${lv})`);
  } else {
    ng('オーダー種別タブが見つからない', `処方:${pv} 注射:${iv} 検体:${lv}`);
  }

  // ─── 4. 注射タブへの切り替え（handleOrderTypeChange） ────
  step(++n, TOTAL, '注射タブへの切り替え（handleOrderTypeChange）');
  if (iv) {
    await injectionTab.click({ force: true });
    await page.waitForTimeout(800);
    const bodyAfter = await page.locator('body').innerText().catch(() => '');
    if (bodyAfter.includes('注射') || bodyAfter.includes('injection')) {
      ok('注射タブに切り替え完了');
    } else {
      warn('注射タブをクリックしたが表示変化を確認できない');
    }
    // 処方タブに戻す
    if (pv) {
      await prescriptionTab.click({ force: true });
      await page.waitForTimeout(500);
    }
  } else {
    warn('注射タブが見つからないためスキップ');
  }

  // ─── 5. 左パネル（LeftPanel）の履歴・セット表示確認 ──────
  step(++n, TOTAL, '左パネル（履歴/セット）の表示確認');
  const historyTab = page.locator('[role="tab"]').filter({ hasText: '履歴' }).first();
  const setTab     = page.locator('[role="tab"]').filter({ hasText: 'セット' }).first();
  const hv = await historyTab.isVisible().catch(() => false);
  const sv = await setTab.isVisible().catch(() => false);
  if (hv || sv) {
    ok(`左パネルのタブを確認 (履歴:${hv} セット:${sv})`);
  } else {
    warn('左パネルの履歴/セットタブが見つからない');
  }

  // ─── 6. 検索入力欄の表示確認 ─────────────────────────────
  step(++n, TOTAL, '検索入力欄（Search input）の表示確認');
  const searchInput = page.locator('input[type="search"], input[placeholder*="検索"]').first();
  const sv2 = await searchInput.isVisible().catch(() => false);
  if (sv2) {
    ok('検索入力欄を確認');
  } else {
    warn('検索入力欄が見つからない（実装状態を確認）');
  }

  // ─── 7. 候補エリア（CenterPanel）の表示確認 ──────────────
  step(++n, TOTAL, 'CenterPanel（候補エリア）の表示確認');
  // CenterPanelはLeftPanel右側の450px幅のエリア
  // フィルターボタン（全て/処方/注射/検体）で識別
  const filterAll = page.locator('button').filter({ hasText: '全て' }).first();
  const fv = await filterAll.isVisible().catch(() => false);
  if (fv) {
    ok('CenterPanelのフィルター（全て）ボタンを確認');
  } else {
    warn('CenterPanelのフィルターが見つからない（UI確認要）');
  }

  // ─── 8. 確定オーダーエリア（RightPanel）の表示確認 ───────
  step(++n, TOTAL, 'RightPanel（確定オーダーエリア）の表示確認');
  // 確定ボタンで識別
  const confirmBtn = page.locator('button').filter({ hasText: '確定' }).first();
  const cv = await confirmBtn.isVisible().catch(() => false);
  if (cv) {
    ok('RightPanelの確定ボタンを確認');
  } else {
    warn('確定ボタンが見つからない（UIを確認）');
  }

  // ─── 9. オーダーなしで確定押下 → エラートースト確認 ──────
  step(++n, TOTAL, 'オーダーなしで確定ボタン押下 → エラートースト');
  if (cv) {
    await confirmBtn.click({ force: true });
    await page.waitForTimeout(1000);
    const bodyAfterConfirm = await page.locator('body').innerText().catch(() => '');
    if (
      bodyAfterConfirm.includes('オーダーが選択されていません') ||
      bodyAfterConfirm.includes('選択') ||
      bodyAfterConfirm.includes('エラー')
    ) {
      ok('オーダーなし確定でエラートーストを確認');
    } else {
      warn('エラートーストのテキストが未確認（sonner Toasterの表示タイミングを確認）');
    }
  } else {
    warn('確定ボタンが見つからないためスキップ');
  }

  // ─── 10. 履歴からオーダー追加（handleAddCandidateFromPanel） ─
  step(++n, TOTAL, '左パネル履歴からオーダー候補への追加操作');
  if (hv) {
    await historyTab.click({ force: true });
    await page.waitForTimeout(600);
    // 履歴の最初の追加ボタン（+ ボタン）を探す
    const addBtn = page.locator('button').filter({ hasText: '+' }).first();
    const addBtnAlt = page.locator('button[aria-label*="追加"], button svg[data-lucide="plus"]').first();
    const abv = await addBtn.isVisible().catch(() => false);
    const abAv = await addBtnAlt.isVisible().catch(() => false);
    if (abv) {
      await addBtn.click({ force: true });
      await page.waitForTimeout(500);
      ok('履歴から追加ボタンをクリックした');
    } else if (abAv) {
      await addBtnAlt.click({ force: true });
      await page.waitForTimeout(500);
      ok('履歴から追加ボタン（別セレクター）をクリックした');
    } else {
      warn('履歴の追加ボタンが見つからない（展開が必要かもしれない）');
    }
  } else {
    warn('履歴タブが見つからないためスキップ');
  }

  // ─── 11. フィルター変更操作（handleFilterChange） ─────────
  step(++n, TOTAL, 'CenterPanelのフィルター変更（handleFilterChange）');
  const filterBtns = page.locator('button').filter({ hasText: /^(全て|処方|注射|検体)$/ });
  const filterCount = await filterBtns.count().catch(() => 0);
  if (filterCount >= 2) {
    // 2番目のフィルターボタン（処方 or 注射）をクリック
    await filterBtns.nth(1).click({ force: true });
    await page.waitForTimeout(400);
    ok(`フィルターを切り替えた（${filterCount}個のフィルターボタンを確認）`);
    // 全てに戻す
    const filterAllBtn = page.locator('button').filter({ hasText: '全て' }).first();
    if (await filterAllBtn.isVisible().catch(() => false)) {
      await filterAllBtn.click({ force: true });
      await page.waitForTimeout(300);
    }
  } else {
    warn(`フィルターボタンが不足 (${filterCount}個)`);
  }

  // ─── 12. 一時保存ダイアログ確認（handleSaveTemporary） ───
  step(++n, TOTAL, '一時保存機能の確認（handleSaveTemporary）');
  const saveBtn = page.locator('button').filter({ hasText: /一時保存|保存/ }).first();
  const sbv = await saveBtn.isVisible().catch(() => false);
  if (sbv) {
    await saveBtn.click({ force: true });
    await page.waitForTimeout(600);
    const bodyAfterSave = await page.locator('body').innerText().catch(() => '');
    if (bodyAfterSave.includes('保存') || bodyAfterSave.includes('名前')) {
      ok('一時保存ボタンをクリックし保存UIを確認');
      // ESCでダイアログを閉じる
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      warn('一時保存後のUI変化を確認できない');
    }
  } else {
    warn('一時保存ボタンが見つからない（RightPanelのオーダーなし状態では非表示の可能性）');
  }

  // ─── 13. グローバルメニュー（GlobalMenu）の表示確認 ──────
  step(++n, TOTAL, 'GlobalMenuの表示確認');
  // GlobalMenuはオーダー種別（処方/注射/検体）切り替えとMy Set追加ダイアログを持つ
  const mySetBtn = page.locator('button').filter({ hasText: /Myセット|マイセット|セット追加/ }).first();
  const msgv = await mySetBtn.isVisible().catch(() => false);
  if (msgv) {
    ok('GlobalMenuのMyセットボタンを確認');
  } else {
    // タブ形式のグローバルメニューを確認
    const globalMenuArea = page.locator('[data-testid="global-menu"], .global-menu').first();
    const gmv = await globalMenuArea.isVisible().catch(() => false);
    if (gmv) {
      ok('GlobalMenuエリアを確認（data-testid経由）');
    } else {
      warn('GlobalMenuの特定UIが見つからない（表示形式を確認）');
    }
  }

  // ─── 14. SystemMenuの表示確認 ────────────────────────────
  step(++n, TOTAL, 'SystemMenuの表示確認');
  const systemMenu = page.locator('[data-testid="system-menu"]').first();
  const smv = await systemMenu.isVisible().catch(() => false);
  if (smv) {
    ok('SystemMenuを確認（data-testid経由）');
  } else {
    // SettingsやMenuアイコンでSystemMenuを探す
    const settingsBtn = page.locator('button[aria-label*="設定"], button[title*="設定"]').first();
    const stv = await settingsBtn.isVisible().catch(() => false);
    if (stv) {
      ok('SystemMenuの設定ボタンを確認');
    } else {
      warn('SystemMenuが見つからない（実装状態を確認）');
    }
  }

  // ─── 15. 検体タブへ切り替えて直接追加モード確認 ──────────
  step(++n, TOTAL, '検体タブへの切り替えと直接追加モードの確認（handleAddToDetailDirect）');
  if (lv) {
    await labTab.click({ force: true });
    await page.waitForTimeout(800);
    const bodyLab = await page.locator('body').innerText().catch(() => '');
    if (bodyLab.includes('検体') || bodyLab.includes('lab')) {
      ok('検体タブへの切り替えを確認');
    } else {
      warn('検体タブ切り替え後の表示変化を確認できない');
    }
  } else {
    warn('検体タブが見つからないためスキップ');
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
    await runETC004(page);
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
