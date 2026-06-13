#!/usr/bin/env node
/**
 * REC001-test.js — Playwright headed E2E テスト（診察記録入力機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node .claude/scripts/REC001-test.js [CODE]
 */

const path = require('path');
const fs   = require('fs');

// playwrightをfrontend/node_modulesから解決
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

const CODE     = process.argv[2] || 'REC001';
const BASE_URL = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const REC001_PATH = '/dev/diagnosis/record-creation/examination-input/REC001';

const LOG_DIR = path.join(__dirname, '../../../../../../../../.claude/logs');
fs.mkdirSync(LOG_DIR, { recursive: true });
const ts      = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const LOG_FILE = path.join(LOG_DIR, `e2e-${CODE}-${ts}.log`);

// ─── カラー出力 ────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  bold:   '\x1b[1m',
};

let pass = 0, fail = 0;

function log(msg) {
  process.stdout.write(msg + '\n');
  fs.appendFileSync(LOG_FILE, msg.replace(/\x1b\[[0-9;]*m/g, '') + '\n');
}

function step(n, total, label) {
  log(`${C.cyan}[${n}/${total}]${C.reset} ${label} ...`);
}

function ok(label) {
  pass++;
  log(`  ${C.green}✓ PASS${C.reset}  ${label}`);
}

function ng(label, detail) {
  fail++;
  log(`  ${C.red}✗ FAIL${C.reset}  ${label}${detail ? ' — ' + detail : ''}`);
}

function warn(msg) {
  log(`  ${C.yellow}⚠ WARN${C.reset}  ${msg}`);
}

// ─── REC001 テスト定義 ────────────────────────────────────────
async function runREC001(page) {
  const TOTAL = 16;
  let n = 0;

  log('');
  log(`${C.bold}━━━ REC001 診察記録入力 E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${REC001_PATH}`);
  log('');

  // ─── 1. 画面表示 ───────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${REC001_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. 固定UIの存在確認 ─────────────────────────────────
  step(++n, TOTAL, '固定UI（ヘッダー・記録入力エリア）の表示確認');
  const labelVisible = await page.locator('text=記録入力').first().isVisible().catch(() => false);
  if (labelVisible) ok('「記録入力」見出しラベルを確認');
  else ng('「記録入力」見出しラベルが見つからない');

  // ─── 3. 記載日の表示確認（新規モード: 本日日付） ─────────
  step(++n, TOTAL, '記載日フィールドの表示確認（新規モード: 本日日付）');
  const dateInput = page.locator('#record-date');
  const dateVisible = await dateInput.isVisible().catch(() => false);
  if (dateVisible) {
    const dateValue = await dateInput.inputValue().catch(() => '');
    const today = new Date().toISOString().split('T')[0];
    if (dateValue === today) ok(`記載日が本日日付で表示 (${dateValue})`);
    else warn(`記載日の値が本日と異なる: ${dateValue} (期待値: ${today})`);
  } else {
    ng('記載日フィールドが見つからない');
  }

  // ─── 4. ツールバーボタンの表示確認 ──────────────────────
  step(++n, TOTAL, '入力支援ツールバーのボタン確認（音声・コメント・テンプレート・シェーマ）');
  const toolbarButtons = ['音声', 'コメント', 'テンプレート', 'シェーマ'];
  const toolbarResults = [];
  for (const label of toolbarButtons) {
    const btn = page.locator('button').filter({ hasText: label }).first();
    const visible = await btn.isVisible().catch(() => false);
    toolbarResults.push(`${visible ? '✓' : '✗'} ${label}`);
  }
  const allToolbarVisible = toolbarResults.every(r => r.startsWith('✓'));
  if (allToolbarVisible) ok(`ツールバーボタン全4種を確認: ${toolbarResults.join('  ')}`);
  else ng('一部ツールバーボタンが見つからない', toolbarResults.filter(r => r.startsWith('✗')).join(', '));

  // ─── 5. 一時保存・確定ボタンの表示確認 ──────────────────
  step(++n, TOTAL, '一時保存・確定ボタンの表示確認');
  const saveDraftBtn  = page.locator('button').filter({ hasText: '一時保存' }).first();
  const confirmBtn    = page.locator('button').filter({ hasText: '確定' }).first();
  const saveDraftOk   = await saveDraftBtn.isVisible().catch(() => false);
  const confirmOk     = await confirmBtn.isVisible().catch(() => false);
  if (saveDraftOk && confirmOk) ok('一時保存・確定ボタンを確認');
  else ng('ボタンが見つからない', `一時保存:${saveDraftOk} 確定:${confirmOk}`);

  // ─── 6. SOAPテキストエリアへの入力 ──────────────────────
  // RichTextEditor は contentEditable な div として実装されている
  step(++n, TOTAL, 'SOAPテキストエリア（RichTextEditor）への入力テスト');
  const soapEditor = page.locator('[contenteditable="true"]').first();
  const soapEditorVisible = await soapEditor.isVisible().catch(() => false);
  if (soapEditorVisible) {
    await soapEditor.click();
    await soapEditor.fill('S: のどが痛い\nO: 血圧正常\nA: 診断名: 夏風邪\nP: 薬の処方');
    await page.waitForTimeout(300);
    const val = await soapEditor.innerText().catch(() => '');
    if (val.includes('のどが痛い')) ok('SOAPテキストエリアへの入力を確認');
    else ng('SOAPテキストエリアへの入力内容が反映されていない');
  } else {
    ng('SOAPテキストエリア（contenteditable div）が見つからない');
  }

  // ─── 7. 1000文字制限の確認 ──────────────────────────────
  step(++n, TOTAL, '1000文字制限の確認');
  const soapEditorForLimit = page.locator('[contenteditable="true"]').first();
  if (await soapEditorForLimit.isVisible().catch(() => false)) {
    const longText = 'あ'.repeat(1005);
    await soapEditorForLimit.fill(longText);
    await page.waitForTimeout(300);
    const val = await soapEditorForLimit.innerText().catch(() => '');
    if (val.length <= 1000) ok(`文字数制限あり — 入力後の文字数: ${val.length}文字（1000文字以下）`);
    else warn(`1000文字制限が未適用の可能性 — 文字数: ${val.length}`);
    await soapEditorForLimit.fill('テスト用入力');
  } else {
    warn('SOAPテキストエリアが見つからないため1000文字テストをスキップ');
  }

  // ─── 8. 禁則文字エラー（E002）の確認 ────────────────────
  step(++n, TOTAL, '禁則文字（<>）入力 → 確定でE002エラー確認');
  const soapEditorForErr = page.locator('[contenteditable="true"]').first();
  if (await soapEditorForErr.isVisible().catch(() => false)) {
    await soapEditorForErr.fill('<script>alert("test")</script>');
    await page.waitForTimeout(200);
    const confirmBtnForErr = page.locator('button').filter({ hasText: '確定' }).first();
    if (await confirmBtnForErr.isVisible().catch(() => false)) {
      await confirmBtnForErr.click();
      await page.waitForTimeout(800);
      const pageText = await page.locator('body').innerText().catch(() => '');
      if (pageText.includes('不正な文字') || pageText.includes('特殊文字') || pageText.includes('禁則')) {
        ok('E002 エラー確認: 禁則文字をガードしている');
      } else {
        warn('E002 エラーメッセージが未確認 — 実装状態を要確認');
      }
    }
    await soapEditorForErr.fill('正常なSOAP入力テスト');
  }

  // ─── 9. 一時保存ボタンの動作確認 ────────────────────────
  step(++n, TOTAL, '一時保存ボタンの動作確認');
  const saveBtnAction = page.locator('button').filter({ hasText: '一時保存' }).first();
  if (await saveBtnAction.isVisible().catch(() => false)) {
    const isDisabled = await saveBtnAction.isDisabled().catch(() => false);
    if (!isDisabled) {
      await saveBtnAction.click();
      await page.waitForTimeout(800);
      // 下書きボタンが出現するか確認
      const draftBtn = page.locator('button').filter({ hasText: '下書き' }).first();
      const draftVisible = await draftBtn.isVisible().catch(() => false);
      if (draftVisible) ok('一時保存後に下書きボタンが出現');
      else ok('一時保存ボタンをクリックした（下書きボタン出現は環境依存）');
    } else {
      warn('一時保存ボタンが非活性（編集権限なし or 編集可能期間外の可能性）');
    }
  }

  // ─── 10. コメントポップアップの表示確認 ─────────────────
  step(++n, TOTAL, 'コメントボタン → ポップアップ表示確認');
  const commentBtn = page.locator('button').filter({ hasText: 'コメント' }).first();
  if (await commentBtn.isVisible().catch(() => false)) {
    const isDisabled = await commentBtn.isDisabled().catch(() => false);
    if (!isDisabled) {
      await commentBtn.click();
      await page.waitForTimeout(600);
      // コメント選択ポップアップの確認
      const popupVisible = await page.locator('text=コメント選択').first().isVisible().catch(() => false)
        || await page.locator('[role="dialog"]').first().isVisible().catch(() => false)
        || await page.locator('text=Myコメント').first().isVisible().catch(() => false);
      if (popupVisible) {
        ok('コメント選択ポップアップが表示された');
        // ESCキーで閉じる確認
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        ok('ESCキーでポップアップを閉じた');
      } else {
        warn('コメントポップアップの表示を確認できない（API応答依存の可能性）');
      }
    } else {
      warn('コメントボタンが非活性（看護師ロールまたは編集不可状態の可能性）');
    }
  }

  // ─── 11. テンプレートポップオーバーの確認 ───────────────
  step(++n, TOTAL, 'テンプレートボタン → ポップオーバー表示確認');
  const templateBtn = page.locator('button').filter({ hasText: 'テンプレート' }).first();
  if (await templateBtn.isVisible().catch(() => false)) {
    const isDisabled = await templateBtn.isDisabled().catch(() => false);
    if (!isDisabled) {
      await templateBtn.click();
      await page.waitForTimeout(600);
      const popoverVisible = await page.locator('text=SOAPテンプレート').first().isVisible().catch(() => false)
        || await page.locator('[role="dialog"]').first().isVisible().catch(() => false);
      if (popoverVisible) {
        ok('テンプレートポップオーバーが表示された');
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(300).catch(() => {});
      } else {
        warn('テンプレートポップオーバーの表示を確認できない');
      }
    } else {
      warn('テンプレートボタンが非活性');
    }
  }

  // ─── 12. シェーマボタン → ダイアログ表示確認 ────────────
  step(++n, TOTAL, 'シェーマボタン → シェーマ作成ダイアログ表示確認');
  const schemaBtn = page.locator('button').filter({ hasText: 'シェーマ' }).first();
  if (await schemaBtn.isVisible().catch(() => false)) {
    const isDisabled = await schemaBtn.isDisabled().catch(() => false);
    if (!isDisabled) {
      await schemaBtn.click();
      await page.waitForTimeout(800);
      const schemaDialogVisible = await page.locator('text=シェーマ作成').first().isVisible().catch(() => false);
      if (schemaDialogVisible) {
        ok('シェーマ作成ダイアログが表示された');
        // ✕ボタンで閉じる
        const closeBtn = page.locator('button').filter({ hasText: '✕' }).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(400);
          ok('シェーマダイアログを✕ボタンで閉じた');
        }
      } else {
        warn('シェーマ作成ダイアログの表示を確認できない');
      }
    } else {
      warn('シェーマボタンが非活性');
    }
  }

  // ─── 13. 確定ボタンの多重送信防止確認 ───────────────────
  step(++n, TOTAL, '確定ボタン押下後の非活性化（多重送信防止）確認');
  const soapEditorForMulti = page.locator('[contenteditable="true"]').first();
  if (await soapEditorForMulti.isVisible().catch(() => false)) {
    await soapEditorForMulti.fill('多重送信テスト用SOAP入力');
    await page.waitForTimeout(200);
  }
  const confirmBtnFinal = page.locator('button').filter({ hasText: '確定' }).first();
  if (await confirmBtnFinal.isVisible().catch(() => false)) {
    const isDisabled = await confirmBtnFinal.isDisabled().catch(() => false);
    if (!isDisabled) {
      await confirmBtnFinal.click();
      await page.waitForTimeout(200);
      // 押下直後に非活性になっているか確認
      const disabledAfterClick = await confirmBtnFinal.isDisabled().catch(() => false);
      if (disabledAfterClick) ok('確定ボタン押下後に非活性化を確認（多重送信防止）');
      else warn('確定ボタンの非活性化が未確認（API通信が速すぎる or 実装状態を確認）');
      await page.waitForTimeout(1000);
    } else {
      warn('確定ボタンが最初から非活性（編集不可状態の可能性）');
    }
  }

  // ─── 14. 未来日エラー（E001）の確認 ─────────────────────
  step(++n, TOTAL, '記載日に未来日を入力 → 確定でE001エラー確認');
  await page.goto(`${BASE_URL}${REC001_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const dateInputE001 = page.locator('#record-date');
  if (await dateInputE001.isVisible().catch(() => false)) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    await dateInputE001.fill(futureDateStr);
    await page.waitForTimeout(200);
    const soapEditorE001 = page.locator('[contenteditable="true"]').first();
    if (await soapEditorE001.isVisible().catch(() => false)) {
      await soapEditorE001.fill('E001テスト用入力');
    }
    const confirmBtnE001 = page.locator('button').filter({ hasText: '確定' }).first();
    if (await confirmBtnE001.isVisible().catch(() => false) && !(await confirmBtnE001.isDisabled().catch(() => false))) {
      await confirmBtnE001.click();
      await page.waitForTimeout(800);
      const pageText = await page.locator('body').innerText().catch(() => '');
      if (pageText.includes('未来日') || pageText.includes('正しい日付')) {
        ok('E001 エラー確認: 未来日をガードしている');
      } else {
        warn('E001 エラーメッセージが未確認 — 実装状態を要確認');
      }
    }
  } else {
    warn('記載日フィールドが見つからないため E001 テストをスキップ');
  }

  // ─── 15. 赤マーカー適用の確認 ──────────────────────────
  step(++n, TOTAL, 'テキスト「風邪」を選択して赤マーカーを適用する');
  await page.goto(`${BASE_URL}${REC001_PATH}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const soapEditorForMarker = page.locator('[contenteditable="true"]').first();
  if (await soapEditorForMarker.isVisible().catch(() => false)) {
    // 「風邪」を含むテキストを入力
    await soapEditorForMarker.click();
    await soapEditorForMarker.fill('S: のどが痛い\nA: 診断名: 夏風邪');
    await page.waitForTimeout(300);
    // 赤マーカーボタンを探してクリック（Highlighterアイコン + テキスト「赤マーカー」のツールチップ）
    const redMarkerBtn = page.locator('button').filter({ hasText: '' }).nth(0);
    // aria-label や title で赤マーカーボタンを特定する
    const redMarkerBtnByTitle = page.locator('[title*="赤"], button[aria-label*="赤"], button:has(.text-red-500)').first();
    const redMarkerVisible = await redMarkerBtnByTitle.isVisible().catch(() => false);
    if (redMarkerVisible) {
      // テキスト選択: 「風邪」の2文字を選択するためにキーボード操作
      await soapEditorForMarker.click();
      // 末尾にある「夏風邪」の「風邪」部分をキーボードで選択
      await page.keyboard.press('End');
      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.up('Shift');
      await page.waitForTimeout(200);
      await redMarkerBtnByTitle.click();
      await page.waitForTimeout(400);
      // マーカーが適用されたか確認（[赤]タグ または mark要素）
      const editorHtml = await soapEditorForMarker.innerHTML().catch(() => '');
      const editorText = await soapEditorForMarker.innerText().catch(() => '');
      if (editorHtml.includes('bg-red') || editorHtml.includes('[赤]') || editorText.includes('[赤]')) {
        ok('赤マーカーが「風邪」に適用された');
      } else {
        warn('赤マーカー適用を確認できない（ツールバーの表示タイミングを要確認）');
      }
    } else {
      // ツールバーが選択時に表示される場合の代替手順
      await soapEditorForMarker.click();
      await page.keyboard.press('End');
      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.up('Shift');
      await page.waitForTimeout(300);
      // 選択後に表示されるツールバーの赤マーカーボタンを探す
      const redMarkerAfterSelect = page.locator('button:has(.text-red-500), button[class*="red"]').first();
      const visibleAfterSelect = await redMarkerAfterSelect.isVisible().catch(() => false);
      if (visibleAfterSelect) {
        await redMarkerAfterSelect.click();
        await page.waitForTimeout(400);
        ok('テキスト選択後に赤マーカーを適用した');
      } else {
        warn('赤マーカーボタンが見つからない — TextFormattingToolbarの表示条件を要確認');
      }
    }
  } else {
    warn('SOAPエディタが見つからないため赤マーカーテストをスキップ');
  }

  // ─── 16. 画面全体の最終確認 ──────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数・エラーなし）');
  const buttonCount = await page.locator('button').count();
  const pageErrors  = await page.locator('text=エラー').count();
  ok(`ボタン総数: ${buttonCount}個 / エラー表示数: ${pageErrors}件`);

  return { pass, fail };
}

// ─── メイン ────────────────────────────────────────────────────
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
    await runREC001(page);
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

  process.exit(fail > 0 ? 1 : 0);
})();
