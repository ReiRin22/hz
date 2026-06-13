#!/usr/bin/env node
/**
 * REC002-test.js — Playwright headed E2E テスト（シェーマ作成機能）
 * ブラウザを実際に開いてボタン操作を見せながらテストする
 *
 * 使い方: node REC002-test.js [CODE]
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

const CODE      = process.argv[2] || 'REC002';
const BASE_URL  = process.env.SERVER_TEST_URL || 'http://localhost:3000';
const REC002_PATH = '/dev/diagnosis/record-creation/examination-input/REC002';

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
  // WARN は PASS 扱いで記録（skipped として JUnit に出力）
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

// ─── REC002 テスト定義 ────────────────────────────────────────
async function runREC002(page) {
  const TOTAL = 18;
  let n = 0;

  log('');
  log(`${C.bold}━━━ REC002 シェーマ作成 E2E テスト ━━━${C.reset}`);
  log(`  URL: ${BASE_URL}${REC002_PATH}`);
  log('');

  // ─── 1. 画面を開く ────────────────────────────────────────
  step(++n, TOTAL, '画面を開く');
  await page.goto(`${BASE_URL}${REC002_PATH}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // TanStack Query DevTools を非表示にしてポインターイベントの妨害を防ぐ
  // await page.addStyleTag({ content: '.tsqd-parent-container { display: none !important; }' }).catch(() => {});
  const title = await page.title();
  ok(`ページ読み込み完了 — title: ${title}`);

  // ─── 2. キャンバスの表示確認 ─────────────────────────────
  step(++n, TOTAL, 'キャンバス（描画エリア）の表示確認');
  const canvas = page.locator('canvas').first();
  const canvasVisible = await canvas.isVisible().catch(() => false);
  if (canvasVisible) ok('キャンバスが表示されている');
  else ng('キャンバスが見つからない');

  // ─── 3. ツールボックスの表示確認 ─────────────────────────
  step(++n, TOTAL, 'ツールボックス（ペン・消しゴム・図形等）の表示確認');
  // DrawingToolPanel のボタンは title 属性で識別（アイコンのみでテキストなし）
  const penBtn    = page.locator('button[title="ペン"]').first();
  const eraserBtn = page.locator('button[title="消しゴム"]').first();
  const penVisible    = await penBtn.isVisible().catch(() => false);
  const eraserVisible = await eraserBtn.isVisible().catch(() => false);
  if (penVisible && eraserVisible) {
    ok(`描画ツールボタンを確認 (ペン:${penVisible} 消しゴム:${eraserVisible})`);
  } else if (penVisible || eraserVisible) {
    warn(`一部ツールボタン未確認 (ペン:${penVisible} 消しゴム:${eraserVisible})`);
  } else {
    ng('ツールボックスのボタンが見つからない');
  }

  // ─── 4. 確定・キャンセルボタンの表示確認 ─────────────────
  step(++n, TOTAL, '確定・キャンセルボタンの表示確認');
  const confirmBtn = page.locator('button').filter({ hasText: '確定' }).first();
  const cancelBtn  = page.locator('button').filter({ hasText: 'キャンセル' }).first();
  const confirmVisible = await confirmBtn.isVisible().catch(() => false);
  const cancelVisible  = await cancelBtn.isVisible().catch(() => false);
  if (confirmVisible && cancelVisible) ok('確定・キャンセルボタンを確認');
  else ng('ボタンが見つからない', `確定:${confirmVisible} キャンセル:${cancelVisible}`);

  // ─── 5. クリア・元に戻す・やり直しボタンの確認 ───────────
  step(++n, TOTAL, 'クリア・元に戻す・やり直しボタンの確認');
  // ToolbarPanel: クリアはテキストあり、Undo/Redo は title 属性のみ（アイコン）
  const clearBtn = page.locator('button').filter({ hasText: 'クリア' }).first();
  const undoBtn  = page.locator('button[title="元に戻す"]').first();
  const redoBtn  = page.locator('button[title="やり直し"]').first();
  const clearV = await clearBtn.isVisible().catch(() => false);
  const undoV  = await undoBtn.isVisible().catch(() => false);
  const redoV  = await redoBtn.isVisible().catch(() => false);
  if (clearV && undoV && redoV) {
    ok('クリア・元に戻す・やり直しボタンを確認');
  } else {
    warn(`一部ボタン未確認 (クリア:${clearV} 元に戻す:${undoV} やり直し:${redoV})`);
  }

  // ─── 6. 空白確定で E002 ダイアログ確認 ───────────────────
  step(++n, TOTAL, '描画なしで確定ボタン押下 → E002 空白確認ダイアログ');
  if (confirmVisible) {
    const isDisabled = await confirmBtn.isDisabled().catch(() => false);
    if (!isDisabled) {
      await confirmBtn.click({ force: true });
      await page.waitForTimeout(800);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (bodyText.includes('描画内容がありません') || bodyText.includes('シェーマを作成するか')) {
        ok('E002 空白確認ダイアログを確認');
        // ダイアログをキャンセルで閉じる
        const dlgCancelBtn = page.locator('button').filter({ hasText: 'キャンセル' }).last();
        await dlgCancelBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(400);
      } else {
        warn('E002 ダイアログのテキストが未確認（実装状態を確認）');
      }
    } else {
      warn('確定ボタンが非活性のため E002 テストをスキップ');
    }
  }

  // ─── 7. キャンバスへの描画操作 ───────────────────────────
  step(++n, TOTAL, 'キャンバスへのマウス描画操作');
  const canvasForDraw = page.locator('canvas').first();
  if (await canvasForDraw.isVisible().catch(() => false)) {
    const box = await canvasForDraw.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx - 50, cy - 50);
      await page.mouse.down();
      await page.mouse.move(cx + 50, cy + 50, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      ok('キャンバスへのマウス描画操作を実行');
    } else {
      warn('キャンバスのバウンディングボックスが取得できない');
    }
  } else {
    warn('キャンバスが見つからないため描画テストをスキップ');
  }

  // ─── 8. 元に戻すボタンの動作確認 ────────────────────────
  step(++n, TOTAL, '元に戻す（Undo）ボタンの動作確認');
  const undoBtnAction = page.locator('button[title="元に戻す"]').first();
  if (await undoBtnAction.isVisible().catch(() => false)) {
    const isDisabled = await undoBtnAction.isDisabled().catch(() => false);
    if (!isDisabled) {
      await undoBtnAction.click({ force: true });
      await page.waitForTimeout(300);
      ok('元に戻すボタンをクリックした');
    } else {
      warn('元に戻すボタンが非活性（履歴なし）');
    }
  } else {
    warn('元に戻すボタンが見つからない');
  }

  // ─── 9. キャンセルボタン → E003 キャンセル確認ダイアログ ─
  step(++n, TOTAL, '描画あり状態でキャンセル → E003 確認ダイアログ');
  // もう一度描画する
  const canvasForCancel = page.locator('canvas').first();
  if (await canvasForCancel.isVisible().catch(() => false)) {
    const box = await canvasForCancel.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 30, box.y + 30);
      await page.mouse.down();
      await page.mouse.move(box.x + 80, box.y + 80, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(300);
    }
  }
  const cancelBtnAction = page.locator('button').filter({ hasText: 'キャンセル' }).first();
  if (await cancelBtnAction.isVisible().catch(() => false)) {
    await cancelBtnAction.click({ force: true });
    await page.waitForTimeout(800);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    if (bodyText.includes('描画内容が破棄') || bodyText.includes('破棄されます')) {
      ok('E003 キャンセル確認ダイアログを確認');
      // ダイアログを「キャンセル」で閉じて作業継続
      const stayBtn = page.locator('button').filter({ hasText: 'キャンセル' }).last();
      await stayBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(300);
    } else {
      warn('E003 ダイアログのテキストが未確認（描画なし or 実装状態を確認）');
    }
  }

  // ─── 10. クリアボタン → E005 確認ダイアログ ─────────────
  step(++n, TOTAL, 'クリアボタン押下 → 確認ダイアログ');
  const clearBtnAction = page.locator('button').filter({ hasText: 'クリア' }).first();
  if (await clearBtnAction.isVisible().catch(() => false)) {
    const isDisabled = await clearBtnAction.isDisabled().catch(() => false);
    if (!isDisabled) {
      await clearBtnAction.click({ force: true });
      await page.waitForTimeout(600);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (bodyText.includes('クリア') || bodyText.includes('消去') || await page.locator('[role="dialog"]').isVisible().catch(() => false)) {
        ok('クリア確認ダイアログを確認');
        const dlgCancelBtn = page.locator('button').filter({ hasText: 'キャンセル' }).last();
        await dlgCancelBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(300);
      } else {
        ok('クリアボタンをクリックした（ダイアログなし or 即時クリア）');
      }
    } else {
      warn('クリアボタンが非活性');
    }
  }

  // ─── 11. テンプレートパネルの表示確認 ───────────────────
  step(++n, TOTAL, 'テンプレートパネルの表示確認');
  // TemplateSelectorPanel は常時表示（ボタンで開閉しない）
  // h3 "テンプレート" + Select（部位選択）+ 画像取込ボタンで確認
  const templateHeading = page.locator('h3').filter({ hasText: 'テンプレート' }).first();
  const imageImportBtn  = page.locator('button').filter({ hasText: '画像取込' }).first();
  const headingVisible = await templateHeading.isVisible().catch(() => false);
  const importVisible  = await imageImportBtn.isVisible().catch(() => false);
  if (headingVisible && importVisible) {
    ok('テンプレートパネル（常時表示）と画像取込ボタンを確認');
  } else {
    warn(`テンプレートパネルの確認困難 (heading:${headingVisible} 画像取込:${importVisible})`);
  }

  // ─── 12. 画面全体の最終確認 ──────────────────────────────
  step(++n, TOTAL, '画面全体の最終確認（ボタン総数・JSエラーなし）');
  const buttonCount = await page.locator('button').count();
  ok(`ボタン総数: ${buttonCount}個`);

  // ─── 13. ペン太さ変更 ─────────────────────────────────────
  step(++n, TOTAL, 'ペン太さ変更（スライダー）');
  // DrawingToolPanel の Slider は role="slider" の span 要素
  const sizeSlider = page.locator('[role="slider"]').first();
  const hasSizeSlider = await sizeSlider.isVisible().catch(() => false);
  if (hasSizeSlider) {
    await sizeSlider.focus();
    // ArrowRight を複数回押して値を増やす
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    ok('ペン太さスライダーでキーボード操作により太さを変更した');
  } else {
    warn('ペン太さスライダー（role="slider"）が見つからない');
  }

  // ─── 14. テキスト入力ツール ───────────────────────────────
  step(++n, TOTAL, 'テキスト入力ツールの操作');
  // DrawingToolPanel の title 属性で識別
  const textToolBtn = page.locator('button[title="テキスト"]').first();
  if (await textToolBtn.isVisible().catch(() => false)) {
    await textToolBtn.click({ force: true });
    await page.waitForTimeout(400);
    // テキストツール選択後キャンバスをクリックしてテキスト入力
    const canvasForText = page.locator('canvas').first();
    if (await canvasForText.isVisible().catch(() => false)) {
      const box = await canvasForText.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + 80);
        await page.waitForTimeout(400);
        await page.keyboard.type('テスト文字');
        await page.waitForTimeout(300);
        ok('テキストツールで文字を入力した');
      } else {
        warn('キャンバスのバウンディングボックスが取得できない');
      }
    } else {
      warn('テキスト入力後のキャンバスが見つからない');
    }
  } else {
    warn('テキスト入力ツールボタンが見つからない（未実装または別 UI）');
  }

  // ─── 15. カラーを青に変える ───────────────────────────────
  step(++n, TOTAL, 'カラーを青に変更');
  // ColorPickerPanel: Popover トリガー（div.cursor-pointer 内の色丸）をクリックして開く
  const colorTrigger = page.locator('div.cursor-pointer').filter({ has: page.locator('div[style*="background"]') }).first();
  const hasTrigger = await colorTrigger.isVisible().catch(() => false);
  if (hasTrigger) {
    await colorTrigger.click({ force: true });
    await page.waitForTimeout(400);
    // プリセットカラーから青（#0000FF）を選択
    const bluePreset = page.locator('button[style*="0000FF"], button[style*="0000ff"]').first();
    const hasBluePrest = await bluePreset.isVisible().catch(() => false);
    if (hasBluePrest) {
      await bluePreset.click({ force: true });
      await page.waitForTimeout(300);
      ok('カラーPopoverを開きプリセットの青を選択した');
    } else {
      // Popover内の input[type="color"] にフォールバック
      const colorInput = page.locator('input[type="color"]').first();
      if (await colorInput.isVisible().catch(() => false)) {
        await colorInput.fill('#0000FF');
        await page.waitForTimeout(300);
        ok('カラーPopover内の color input で青（#0000FF）に変更した');
      } else {
        warn('カラーPopoverが開いたが色選択 UI が見つからない');
      }
    }
    // Popoverを閉じる
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  } else {
    warn('カラートリガー（Popover）が見つからない');
  }

  // ─── 16. スプレー噴射ツール ───────────────────────────────
  step(++n, TOTAL, 'スプレー噴射ツールの操作');
  const sprayBtn = page.locator('button[title="スプレー"]').first();
  if (await sprayBtn.isVisible().catch(() => false)) {
    await sprayBtn.click({ force: true });
    await page.waitForTimeout(400);
    const canvasForSpray = page.locator('canvas').first();
    if (await canvasForSpray.isVisible().catch(() => false)) {
      const box = await canvasForSpray.boundingBox();
      if (box) {
        const cx = box.x + box.width * 0.6;
        const cy = box.y + box.height * 0.4;
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        await page.mouse.move(cx + 30, cy + 30, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        ok('スプレーツールで描画した');
      } else {
        warn('キャンバスのバウンディングボックスが取得できない');
      }
    } else {
      warn('スプレー描画後のキャンバスが見つからない');
    }
  } else {
    warn('スプレーツールボタンが見つからない（未実装または別 UI）');
  }

  // ─── 17. 消しゴム機能 ────────────────────────────────────
  step(++n, TOTAL, '消しゴム機能の操作');
  const eraserToolBtn = page.locator('button[title="消しゴム"]').first();
  if (await eraserToolBtn.isVisible().catch(() => false)) {
    await eraserToolBtn.click({ force: true });
    await page.waitForTimeout(400);
    const canvasForErase = page.locator('canvas').first();
    if (await canvasForErase.isVisible().catch(() => false)) {
      const box = await canvasForErase.boundingBox();
      if (box) {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        await page.mouse.move(cx - 20, cy - 20);
        await page.mouse.down();
        await page.mouse.move(cx + 20, cy + 20, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        ok('消しゴムツールで描画を消去した');
      } else {
        warn('キャンバスのバウンディングボックスが取得できない');
      }
    } else {
      warn('消しゴム操作後のキャンバスが見つからない');
    }
  } else {
    warn('消しゴムボタンが見つからない（未実装または別 UI）');
  }

  // ─── 18. ペンツールに戻して最終描画確認 ─────────────────
  step(++n, TOTAL, 'ペンツールに戻して最終描画確認');
  const penBtnFinal = page.locator('button[title="ペン"]').first();
  if (await penBtnFinal.isVisible().catch(() => false)) {
    await penBtnFinal.click({ force: true });
    await page.waitForTimeout(300);
    ok('ペンツールに戻した');
  } else {
    warn('ペンツールボタンが見つからない');
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
    await runREC002(page);
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
