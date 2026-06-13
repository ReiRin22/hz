import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('DEP009 実施者ID入力欄の動作確認', () => {
  test('実施者ID入力欄にテキストを入力できること', async ({ page }) => {
    // DEP009ページへ移動
    await page.goto('/dev/dept-instruction/dept-instruction/patient-id-check/DEP009');

    // ページが読み込まれるまで待つ
    await page.waitForLoadState('domcontentloaded');

    // スクリーンショット1: ページ初期状態
    await page.screenshot({ path: '/tmp/DEP009_initial.png', fullPage: true });
    console.log('スクリーンショット1を保存: /tmp/DEP009_initial.png');

    // 「実施者情報」セクションを見つける
    const practitionerSection = page.locator('text=実施者情報').first();
    await expect(practitionerSection).toBeVisible({ timeout: 10000 });
    console.log('実施者情報セクションが表示されています');

    // 「ID:」ラベルの右にあるテキスト入力欄を見つける
    const idLabel = page.locator('text=ID:').first();
    await expect(idLabel).toBeVisible({ timeout: 10000 });
    console.log('ID:ラベルが表示されています');

    // Input要素を見つける (ID:ラベルの隣)
    // 実施者情報セクション内のInput要素
    const practitionerInput = page.locator('input[placeholder="IDを入力"]');
    await expect(practitionerInput).toBeVisible({ timeout: 10000 });
    console.log('実施者ID入力欄が表示されています');

    // 入力欄のdisabled状態を確認
    const isDisabled = await practitionerInput.isDisabled();
    console.log('入力欄のdisabled状態:', isDisabled);

    // 入力欄をクリック
    await practitionerInput.click();
    console.log('入力欄をクリックしました');

    // "TEST123" とタイプ
    await practitionerInput.fill('TEST123');
    console.log('TEST123を入力しました');

    // 入力された値を確認
    const inputValue = await practitionerInput.inputValue();
    console.log('入力された値:', inputValue);

    // スクリーンショット2: テキスト入力後
    await page.screenshot({ path: '/tmp/DEP009_after_input.png', fullPage: true });
    console.log('スクリーンショット2を保存: /tmp/DEP009_after_input.png');

    // テキストが入力されているか確認
    expect(inputValue).toBe('TEST123');
    console.log('テキスト入力確認: 成功');
  });

  test('実施者ID入力欄のキーボード入力が動作すること', async ({ page }) => {
    await page.goto('/dev/dept-instruction/dept-instruction/patient-id-check/DEP009');
    await page.waitForLoadState('domcontentloaded');

    const practitionerInput = page.locator('input[placeholder="IDを入力"]');
    await expect(practitionerInput).toBeVisible({ timeout: 10000 });

    // 入力欄のdisabled状態を確認
    const isDisabled = await practitionerInput.isDisabled();
    console.log('入力欄のdisabled状態:', isDisabled);

    if (isDisabled) {
      console.log('警告: 入力欄がdisabledになっています - バグを検出しました');
    }

    // クリックしてフォーカスを当てる
    await practitionerInput.click();

    // キーボードで1文字ずつ入力
    await page.keyboard.type('TEST123');

    const inputValue = await practitionerInput.inputValue();
    console.log('キーボード入力後の値:', inputValue);

    await page.screenshot({ path: '/tmp/DEP009_keyboard_input.png', fullPage: true });

    expect(inputValue).toBe('TEST123');
  });
});
