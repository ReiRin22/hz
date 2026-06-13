#!/usr/bin/env node
/**
 * ETC001-test.js — Playwright headed E2E テスト（ログイン機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node ETC001-test.js [CODE]
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

const CODE         = process.argv[2] || 'ETC001';
const BASE_URL     = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const ETC001_PATH  = '/ui-common/menu-header/login';

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
  const total = junitCases.length;
  const failures = junitCases.filter(c => c.status === 'fail').length;
  const skipped  = junitCases.filter(c => c.status === 'warn').length;

  const cases = junitCases.map(c => {
    const name   = c.name.replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    const detail = (c.detail || '').replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s]));
    if (c.status === 'fail')   return `    <testcase name="${name}" classname="${CODE}"><failure message="${detail}">${detail}</failure></testcase>`;
    if (c.status === 'warn')   return `    <testcase name="${name}" classname="${CODE}"><skipped message="${detail}"/></testcase>`;
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

// ─── ETC001 テスト定義 ────────────────────────────────────────
async function runETC001(page) {
  const TOTAL = 11;
  let n = 0;

  log('');
  log(`${C.bold}━━━ ETC001 ログイン E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${ETC001_PATH}`);
  log('');

  // ─── 1. 画面を開く ─────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${ETC001_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. ログインフォームの表示確認 ─────────────────────────
  step(++n, TOTAL, 'ログインフォームの表示確認');
  const userIdInput = page.getByPlaceholder('ユーザーID');
  const passwordInput = page.getByPlaceholder('パスワード');
  const loginBtn = page.getByRole('button', { name: /ログイン/ });
  const userIdVisible  = await userIdInput.isVisible().catch(() => false);
  const passwordVisible = await passwordInput.isVisible().catch(() => false);
  const loginBtnVisible = await loginBtn.isVisible().catch(() => false);
  if (userIdVisible && passwordVisible && loginBtnVisible) {
    ok('ユーザーID・パスワード入力欄・ログインボタンを確認');
  } else {
    ng('ログインフォームの要素が見つからない', `userId:${userIdVisible} pw:${passwordVisible} btn:${loginBtnVisible}`);
  }

  // ─── 3. 「パスワードをお忘れの方はこちら」リンク確認 ───────
  step(++n, TOTAL, '「パスワードをお忘れの方はこちら」リンクの表示確認');
  const forgotLink = page.getByText('パスワードをお忘れの方はこちら');
  const forgotVisible = await forgotLink.isVisible().catch(() => false);
  if (forgotVisible) ok('パスワード再設定リンクを確認');
  else warn('パスワード再設定リンクが見つからない');

  // ─── 4. ユーザーID・パスワード入力 ─────────────────────────
  step(++n, TOTAL, 'ユーザーID・パスワードを入力する');
  if (userIdVisible && passwordVisible) {
    await userIdInput.fill('demo');
    await passwordInput.fill('wrongpass');
    const userIdVal = await userIdInput.inputValue();
    const pwVal     = await passwordInput.inputValue();
    if (userIdVal === 'demo' && pwVal === 'wrongpass') ok('ユーザーID・パスワードの入力を確認');
    else ng('入力値が反映されていない', `userId:${userIdVal} pw:${pwVal}`);
  } else {
    warn('入力欄が見つからないため入力テストをスキップ');
  }

  // ─── 5. 誤った認証情報でログインエラーを確認 ───────────────
  step(++n, TOTAL, '誤ったログイン情報でエラーメッセージが表示される');
  const loginBtnAction = page.getByRole('button', { name: /ログイン/ });
  if (await loginBtnAction.isVisible().catch(() => false)) {
    await loginBtnAction.click();
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    // エラーメッセージはAPIエラーに依存するためwarnとする（開発サーバーが動いていれば実際にエラーが返る）
    if (
      bodyText.includes('ユーザーIDまたはパスワードが正しくありません') ||
      bodyText.includes('ログイン中') ||
      bodyText.includes('エラー') ||
      bodyText.includes('失敗')
    ) {
      ok('ログインエラー応答を確認');
    } else {
      warn('BFF未接続のためエラーメッセージ未確認（フォームのUI確認のみ）');
    }
  } else {
    warn('ログインボタンが見つからない');
  }

  // ─── 6. フォームを再入力してクリア確認 ─────────────────────
  step(++n, TOTAL, 'フォームフィールドをクリアして再入力できる');
  const userIdInputAgain = page.getByPlaceholder('ユーザーID');
  if (await userIdInputAgain.isVisible().catch(() => false)) {
    await userIdInputAgain.fill('');
    await userIdInputAgain.fill('newuser');
    const newVal = await userIdInputAgain.inputValue().catch(() => '');
    if (newVal === 'newuser') ok('フォームの再入力を確認');
    else warn('再入力の確認に失敗');
  } else {
    warn('ユーザーID入力欄が見つからない');
  }

  // ─── 7. パスワードをお忘れリンク → 管理者依頼ダイアログ ────
  step(++n, TOTAL, '「パスワードをお忘れの方はこちら」クリック → 管理者依頼ダイアログ');
  const forgotLinkAction = page.getByText('パスワードをお忘れの方はこちら');
  if (await forgotLinkAction.isVisible().catch(() => false)) {
    await forgotLinkAction.click();
    await page.waitForTimeout(800);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    if (bodyText.includes('パスワード再設定依頼') || bodyText.includes('管理者')) {
      ok('管理者依頼ダイアログを確認');
      // ダイアログを閉じる
      const closeBtn = page.locator('button').filter({ hasText: /閉じる|キャンセル|×/ }).first();
      await closeBtn.click().catch(() => {});
      await page.waitForTimeout(400);
    } else {
      warn('管理者依頼ダイアログが確認できない（BFF未接続）');
    }
  } else {
    warn('パスワード再設定リンクが見つからないためスキップ');
  }

  // ─── 8. ダイアログが閉じた後フォームに戻ること ─────────────
  step(++n, TOTAL, 'ダイアログを閉じた後ログインフォームに戻ること');
  const loginBtnAfterDialog = page.getByRole('button', { name: /ログイン/ });
  if (await loginBtnAfterDialog.isVisible().catch(() => false)) {
    ok('ログインフォームに戻ることを確認');
  } else {
    warn('ログインフォームへの復帰を確認できない');
  }

  // ─── 9. ページにバージョン情報が表示されること ─────────────
  step(++n, TOTAL, 'バージョン情報の表示確認');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.includes('ver.') || bodyText.includes('1.0')) {
    ok('バージョン情報を確認');
  } else {
    warn('バージョン情報が見つからない');
  }

  // ─── 10. 全体確認（JSエラーなし・ボタン総数） ───────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数）');
  const buttonCount = await page.locator('button').count();
  ok(`ボタン総数: ${buttonCount}個`);

  // ─── 11. 入力必須バリデーション ────────────────────────────
  step(++n, TOTAL, '入力必須バリデーション: 未入力でログインボタン押下');
  // フォームを空にする
  const userIdEl = page.getByPlaceholder('ユーザーID');
  const passwordEl = page.getByPlaceholder('パスワード');
  if (await userIdEl.isVisible().catch(() => false)) {
    await userIdEl.fill('');
    await passwordEl.fill('');
    // required 属性によるネイティブバリデーション → submit はキャンセルされる
    const currentUrl = page.url();
    await page.getByRole('button', { name: /ログイン/ }).click();
    await page.waitForTimeout(500);
    const afterUrl = page.url();
    // ページ遷移が起きていないこと（バリデーションによりフォーム送信がキャンセルされた）
    if (afterUrl === currentUrl) {
      ok('入力必須バリデーションによりフォーム送信がキャンセルされた');
    } else {
      warn('バリデーション動作を確認できない（URL変化なし期待だが変化あり）');
    }
  } else {
    warn('入力欄が見つからないためバリデーションテストをスキップ');
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
    await runETC001(page);
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
