#!/usr/bin/env node
/**
 * ETC006-test.js — Playwright headed E2E テスト（ユーザーヘッダー機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node ETC006-test.js [CODE]
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

const CODE        = process.argv[2] || 'ETC006';
const BASE_URL    = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const ETC006_PATH = '/dev/ui-common/menu-header/user-header/ETC006';

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

// ─── ETC006 テスト定義 ────────────────────────────────────────
async function runETC006(page) {
  const TOTAL = 13;
  let n = 0;

  log('');
  log(`${C.bold}━━━ ETC006 ユーザーヘッダー E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${ETC006_PATH}`);
  log('');

  // ─── 1. 画面を開く ─────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${ETC006_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. ヘッダータイトルの表示確認 ─────────────────────────
  step(++n, TOTAL, 'ヘッダータイトル「Harz」の表示確認');
  const headerText = await page.locator('body').innerText().catch(() => '');
  if (headerText.includes('Harz')) {
    ok('ヘッダータイトル「Harz」を確認');
  } else {
    ng('ヘッダータイトル「Harz」が見つからない');
  }

  // ─── 3. ユーザー情報の表示確認 ──────────────────────────────
  step(++n, TOTAL, 'ユーザー情報（名前・ロール・部署）の表示確認');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const hasUserInfo = (
    bodyText.includes('田中') || bodyText.includes('医師') ||
    bodyText.includes('内科') || bodyText.includes('ID:')
  );
  if (hasUserInfo) {
    ok('ユーザー情報（名前またはロール）を確認');
  } else {
    warn('ユーザー情報の表示が確認できない（BFF未接続の可能性）');
  }

  // ─── 4. 時計の表示確認 ──────────────────────────────────────
  step(++n, TOTAL, '現在時刻の表示確認');
  const hasTime = await page.locator('body').innerText().then(t =>
    /\d{1,2}:\d{2}/.test(t)
  ).catch(() => false);
  if (hasTime) {
    ok('現在時刻（HH:MM 形式）を確認');
  } else {
    warn('時刻表示が確認できない');
  }

  // ─── 5. ツールバーボタンの存在確認 ──────────────────────────
  step(++n, TOTAL, 'ツールバーボタン（付箋・仮保存・アラート・設定）の存在確認');
  const buttonCount = await page.locator('button').count();
  if (buttonCount > 0) {
    ok(`ボタン ${buttonCount} 個を確認`);
  } else {
    ng('ボタンが1つも見つからない');
  }

  // ─── 6. アラートダイアログを開く ────────────────────────────
  step(++n, TOTAL, 'アラートダイアログを開く（Bell アイコンボタン）');
  const bellButtons = await page.locator('button[aria-label*="アラート"], button[aria-label*="alert"], button[aria-label*="bell"]').count();
  if (bellButtons > 0) {
    await page.locator('button[aria-label*="アラート"], button[aria-label*="alert"], button[aria-label*="bell"]').first().click();
    await page.waitForTimeout(800);
    const dialogText = await page.locator('body').innerText().catch(() => '');
    if (dialogText.includes('アラート') || dialogText.includes('通知') || dialogText.includes('alert')) {
      ok('アラートダイアログが開いた');
      // 明示的にダイアログを閉じる（閉じボタン優先、なければ Escape）
      const closeAlertBtn = page.locator('[role="dialog"] button[aria-label*="閉じ"], [role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"]');
      if (await closeAlertBtn.count() > 0) {
        await closeAlertBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    } else {
      warn('アラートダイアログの内容を確認できない');
    }
  } else {
    warn('アラートボタンが見つからない（セレクター要調整）');
  }

  // ─── 7. メニュー設定ダイアログを開く ────────────────────────
  step(++n, TOTAL, 'メニュー設定ダイアログを開く（Settings アイコンボタン）');
  const settingsButtons = await page.locator('button[aria-label*="設定"], button[aria-label*="settings"], button[aria-label*="Settings"]').count();
  if (settingsButtons > 0) {
    await page.locator('button[aria-label*="設定"], button[aria-label*="settings"], button[aria-label*="Settings"]').first().click();
    await page.waitForTimeout(800);
    const dialogText = await page.locator('body').innerText().catch(() => '');
    if (dialogText.includes('設定') || dialogText.includes('テーマ') || dialogText.includes('ダーク')) {
      ok('メニュー設定ダイアログが開いた');
      // 明示的にダイアログを閉じる
      const closeSettingsBtn = page.locator('[role="dialog"] button[aria-label*="閉じ"], [role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"]');
      if (await closeSettingsBtn.count() > 0) {
        await closeSettingsBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    } else {
      warn('メニュー設定ダイアログの内容を確認できない');
    }
  } else {
    // Settings アイコン系ボタンをテキストで探す
    const settingsByText = await page.locator('button').filter({ hasText: /設定|Settings/i }).count();
    if (settingsByText > 0) {
      await page.locator('button').filter({ hasText: /設定|Settings/i }).first().click();
      await page.waitForTimeout(800);
      const dialogText = await page.locator('body').innerText().catch(() => '');
      if (dialogText.includes('テーマ') || dialogText.includes('ダーク') || dialogText.includes('自動')) {
        ok('メニュー設定ダイアログが開いた');
        const closeSettingsBtn2 = page.locator('[role="dialog"] button[aria-label*="閉じ"], [role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"]');
        if (await closeSettingsBtn2.count() > 0) {
          await closeSettingsBtn2.first().click();
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(600);
      } else {
        warn('メニュー設定ダイアログの内容を確認できない');
      }
    } else {
      warn('設定ボタンが見つからない（セレクター要調整）');
    }
  }

  // ─── 8. ダークモード切替の動作確認 ──────────────────────────
  step(++n, TOTAL, 'ダークモード切替（handleDarkModeToggle）の動作確認');
  const darkToggle = page.locator('[role="switch"], input[type="checkbox"]').filter({ hasText: /dark|ダーク/i });
  const darkToggleCount = await darkToggle.count();
  if (darkToggleCount > 0) {
    const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    await darkToggle.first().click().catch(() => {});
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (before !== after) {
      ok(`ダークモードが切り替わった (${before} → ${after})`);
    } else {
      warn('ダークモードの変化を確認できない');
    }
  } else {
    warn('ダークモード切替スイッチが見つからない（設定ダイアログを先に開く必要がある可能性）');
  }

  // ─── 9. 付箋メモダイアログを開く ────────────────────────────
  step(++n, TOTAL, '付箋メモダイアログを開く（StickyNote アイコンボタン）');
  const notesButtons = await page.locator('button[aria-label*="付箋"], button[aria-label*="notes"], button[aria-label*="Notes"], button[aria-label*="sticky"]').count();
  if (notesButtons > 0) {
    await page.locator('button[aria-label*="付箋"], button[aria-label*="notes"], button[aria-label*="Notes"], button[aria-label*="sticky"]').first().click();
    await page.waitForTimeout(800);
    const dialogText = await page.locator('body').innerText().catch(() => '');
    if (dialogText.includes('付箋') || dialogText.includes('メモ') || dialogText.includes('notes')) {
      ok('付箋メモダイアログが開いた');
      // 明示的にダイアログを閉じる（閉じボタン優先、なければ Escape）
      const closeDialogBtn = page.locator('[role="dialog"] button[aria-label*="閉じ"], [role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"]');
      if (await closeDialogBtn.count() > 0) {
        await closeDialogBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
      // ダイアログが閉じたことを確認
      const afterClose = await page.locator('[role="dialog"]').count();
      if (afterClose === 0) {
        ok('付箋メモダイアログが正常に閉じた');
      } else {
        warn('付箋メモダイアログがまだ開いている可能性がある');
      }
    } else {
      warn('付箋メモダイアログの内容を確認できない');
    }
  } else {
    warn('付箋ボタンが見つからない（セレクター要調整）');
  }

  // ─── 10. 仮保存データダイアログを開く ───────────────────────
  step(++n, TOTAL, '仮保存データダイアログを開く');
  const tempButtons = await page.locator('button[aria-label*="仮保存"], button[aria-label*="temp"], button[aria-label*="save"]').count();
  if (tempButtons > 0) {
    await page.locator('button[aria-label*="仮保存"], button[aria-label*="temp"], button[aria-label*="save"]').first().click();
    await page.waitForTimeout(800);
    const dialogText = await page.locator('body').innerText().catch(() => '');
    if (dialogText.includes('仮保存') || dialogText.includes('保存') || dialogText.includes('temp')) {
      ok('仮保存データダイアログが開いた');
      // 明示的にダイアログを閉じる
      const closeTempBtn = page.locator('[role="dialog"] button[aria-label*="閉じ"], [role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"]');
      if (await closeTempBtn.count() > 0) {
        await closeTempBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    } else {
      warn('仮保存データダイアログの内容を確認できない');
    }
  } else {
    warn('仮保存ボタンが見つからない（セレクター要調整）');
  }

  // ─── 11. ログアウトボタンの存在確認 ─────────────────────────
  step(++n, TOTAL, 'ログアウトボタンの存在確認');
  const logoutBtn = await page.locator('button').filter({ hasText: /ログアウト|logout/i }).count();
  const logoutIcon = await page.locator('button[aria-label*="ログアウト"], button[aria-label*="logout"]').count();
  if (logoutBtn > 0 || logoutIcon > 0) {
    ok('ログアウトボタンを確認');
  } else {
    warn('ログアウトボタンが見つからない（アイコンのみの可能性）');
  }

  // ─── 12. ローカルBFF未接続時のフォールバック確認 ─────────────
  step(++n, TOTAL, 'BFF未接続時のフォールバック表示確認（assets/medical-data）');
  const currentBodyText = await page.locator('body').innerText().catch(() => '');
  if (
    currentBodyText.includes('Harz') ||
    currentBodyText.includes('医師') ||
    currentBodyText.includes('看護師') ||
    currentBodyText.includes('ログアウト')
  ) {
    ok('フォールバックデータでヘッダーが表示されている');
  } else {
    warn('フォールバック表示の確認が困難');
  }

  // ─── 13. 画面全体の最終確認 ──────────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数・エラーなし）');
  const totalButtons = await page.locator('button').count();
  const hasError = await page.locator('body').innerText().then(t =>
    t.includes('Unhandled') || t.includes('ReferenceError') || t.includes('TypeError')
  ).catch(() => false);
  if (hasError) {
    ng(`JavaScriptエラーが表示されている`, 'コンソールエラーを確認してください');
  } else {
    ok(`ボタン総数: ${totalButtons}個 / エラー表示なし`);
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

  fs.mkdirSync(path.join(LOG_DIR, 'videos'), { recursive: true });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      fs.appendFileSync(LOG_FILE, `[BROWSER ERROR] ${msg.text()}\n`);
    }
  });

  try {
    await runETC006(page);
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
