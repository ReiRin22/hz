#!/usr/bin/env node
/**
 * REC002 簡易テスト - Fabric.js エラー確認用
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  // コンソールエラーを監視
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}]`, msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
  });

  // ページを開く
  await page.goto('http://localhost:3000/dev/diagnosis/record-creation/examination-input/REC002');
  await page.waitForTimeout(3000);

  // canvas 要素をチェック
  const canvasCount = await page.locator('canvas').count();
  console.log(`\nCanvas要素数: ${canvasCount}`);

  if (canvasCount > 0) {
    console.log('✓ Canvas が見つかりました');
  } else {
    console.log('✗ Canvas が見つかりません');

    // DOM構造を確認
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('\nDOM構造の一部:');
    console.log(bodyHTML.substring(0, 500));
  }

  // 10秒待機してから終了
  console.log('\n10秒後に終了します...');
  await page.waitForTimeout(10000);
  await browser.close();
})();
