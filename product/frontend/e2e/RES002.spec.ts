import { test, expect, Page, Route } from '@playwright/test';

const URL = '/06/02/01/RES002';

// BFF モックデータ
const mockTestResults = [
  {
    id: '1',
    itemCode: '1001',
    itemName: '血糖',
    resultValue: '150',
    unit: 'mg/dL',
    referenceValueDisplay: '70-109',
    judgment: 'H',
    device: 'AUTO-1',
    measurementDateTime: '2024/09/19 11:30',
    decimalPlaces: 0,
    comment: '',
    status: 'verified',
    hasError: false,
    selected: false,
    previousResultValue: '145',
    hasPreviousResult: true,
    criticalLower: null,
    criticalUpper: null,
    lowerLimit: 70,
    upperLimit: 109,
    testDate: '2024/09/19',
    hasTestDate: true,
    isEditable: true,
    isAddedItem: false,
    reasonRequired: false,
  },
  {
    id: '2',
    itemCode: '2001',
    itemName: '白血球数',
    resultValue: '',
    unit: '/μL',
    referenceValueDisplay: null,
    judgment: '',
    device: '',
    measurementDateTime: '',
    decimalPlaces: 0,
    comment: '',
    status: 'not-entered',
    hasError: false,
    selected: false,
    previousResultValue: '',
    hasPreviousResult: false,
    criticalLower: null,
    criticalUpper: null,
    lowerLimit: 3300,
    upperLimit: 8600,
    testDate: '',
    hasTestDate: true,
    isEditable: true,
    isAddedItem: false,
    reasonRequired: false,
  },
];

const mockTestItems = [
  { code: '3001', name: 'C反応性蛋白', unit: 'mg/dL', lowerReference: '0.00', upperReference: '0.14', judgment: '正常' },
  { code: '3002', name: 'AST(GOT)', unit: 'IU/L', lowerReference: '13', upperReference: '30', judgment: '正常' },
];

const mockReasons = ['検査値の入力ミス', '再検査による結果更新', 'その他'];

/** 共通ルートモック設定（/save を先に登録して具体的パターンを優先させる） */
async function setupRouteMocks(page: Page, testResultsOverride = mockTestResults) {
  await page.route('**/bff/orders/*/test-results/save', async (route: Route) => {
    await route.fulfill({ status: 200, json: {} });
  });
  await page.route('**/bff/orders/*/test-results', async (route: Route) => {
    await route.fulfill({ json: testResultsOverride });
  });
  await page.route('**/bff/test-items**', async (route: Route) => {
    await route.fulfill({ json: mockTestItems });
  });
  await page.route('**/bff/modification-reason', async (route: Route) => {
    await route.fulfill({ json: mockReasons });
  });
}

/** ページロード完了を待つ（テーブル表示まで待機） */
async function gotoAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-ui-id="TBL_TEST_RESULTS"]')).toBeVisible();
}

// COL_REFERENCE_VALUE_DISPLAY: TableHead も同属性を持つため tbody 内でスコープする
const refValueNullRow = (page: Page) =>
  page.locator('tbody tr').filter({ hasText: '白血球数' }).locator('[data-ui-id="COL_REFERENCE_VALUE_DISPLAY"]');

// -----------------------------------------------------------------------
// TC-001: 画面初期表示
// -----------------------------------------------------------------------
test('TC-001: 画面初期表示 — タブ・ヘッダ・テーブルが表示される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  await expect(page.locator('[data-ui-id="TAB_EDIT"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="TAB_REF"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_ITEM_REFERENCE"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_ITEM_DELETE"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="TBL_TEST_RESULTS"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_CONFIRM"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_CANCEL"]')).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-002: 編集中バッジ表示
// -----------------------------------------------------------------------
test('TC-002: lockInfo.lockBy=SELF のとき BDG_EDIT が表示される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  await expect(page.locator('[data-ui-id="BDG_EDIT"]')).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-003: 異常値行ハイライト（COL_JUDGMENT != 'N'）
// -----------------------------------------------------------------------
test('TC-003: H/L 判定の行は黄色ハイライトが付く', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  const abnormalRow = page.locator('tbody tr').filter({ hasText: '血糖' });
  await expect(abnormalRow).toHaveClass(/bg-yellow-50/);
});

// -----------------------------------------------------------------------
// TC-004: EVT_UI_01 — 検査項目検索ダイアログからの追加
// -----------------------------------------------------------------------
test('TC-004: EVT_UI_01 — 項目追加ボタン押下でダイアログが開き、選択で行が追加される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  await page.locator('[data-ui-id="BTN_ITEM_REFERENCE"]').click();

  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="SRCH_TEST_CODE"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_SEARCH"]')).toBeVisible();

  await page.locator('[data-ui-id="BTN_SEARCH"]').click();
  const itemBtn = page.locator('[data-ui-id="BTN_ITEM"]').first();
  await expect(itemBtn).toBeVisible({ timeout: 10000 });
  // ボタンのテキストは "{code}:{name}\nコード: {code}" 形式
  const rawText = await itemBtn.locator('.font-medium').textContent() ?? '';
  const addedItemName = rawText.split(':')[1]?.trim() ?? '';
  await itemBtn.click();

  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).not.toBeVisible();
  await expect(page.locator('td', { hasText: addedItemName })).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-005: EVT_UI_01 検索ダイアログのキャンセル
// -----------------------------------------------------------------------
test('TC-005: 検査項目検索ダイアログのキャンセルでダイアログが閉じる', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  await page.locator('[data-ui-id="BTN_ITEM_REFERENCE"]').click();
  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).toBeVisible();

  // ダイアログ内のキャンセルボタンをスコープして押す
  await page.locator('[role="dialog"]').locator('[data-ui-id="BTN_CANCEL"]').click();
  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).not.toBeVisible();
});

// -----------------------------------------------------------------------
// TC-006: EVT_ROW_DELETE — 追加項目のみ削除可能
// -----------------------------------------------------------------------
test('TC-006: EVT_ROW_DELETE — 追加項目のみ選択時に削除ボタンが活性化する', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  await expect(page.locator('[data-ui-id="BTN_ITEM_DELETE"]')).toBeDisabled();

  // 項目を追加
  await page.locator('[data-ui-id="BTN_ITEM_REFERENCE"]').click();
  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).toBeVisible();
  await page.locator('[data-ui-id="BTN_SEARCH"]').click();
  const itemBtn = page.locator('[data-ui-id="BTN_ITEM"]').first();
  await expect(itemBtn).toBeVisible({ timeout: 10000 });
  const addedName = (await itemBtn.textContent() ?? '').split(':')[1]?.trim() ?? '';
  await itemBtn.click();
  await expect(page.locator('[data-ui-id="SRCH_TEST_ITEM"]')).not.toBeVisible();

  // 追加行（先頭）のチェックボックスをON（Radix Checkboxは button[role="checkbox"]）
  await page.locator('tbody tr').first().locator('[role="checkbox"]').click();

  await expect(page.locator('[data-ui-id="BTN_ITEM_DELETE"]')).toBeEnabled();

  // 削除実行
  await page.locator('[data-ui-id="BTN_ITEM_DELETE"]').click();
  await expect(page.locator('td', { hasText: addedName })).not.toBeVisible();

  // 既存行（血糖・白血球数）は削除されていないこと
  await expect(page.locator('td', { hasText: '血糖' })).toBeVisible();
  await expect(page.locator('td', { hasText: '白血球数' })).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-007: E001 — 結果値に数値以外を入力するとエラーラベル表示
// -----------------------------------------------------------------------
test('TC-007: E001 — 結果値に"abc"を入力するとエラーが表示される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  const resultInput = page.locator('[data-ui-id="COL_RESULT"] input').first();
  await resultInput.fill('abc');
  await resultInput.blur();

  await expect(page.locator('text=数値で入力してください').first()).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-008: E001 — 確定ボタン押下時に空の結果値がエラーになる
// -----------------------------------------------------------------------
test('TC-008: E001 — 確定ボタン押下時に空の結果値があるとエラーが表示される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  // 白血球数の resultValue は '' のまま確定を押す
  let saveApiCalled = false;
  await page.route('**/bff/orders/*/test-results/save', async (route: Route) => {
    saveApiCalled = true;
    await route.fulfill({ status: 200, json: {} });
  });

  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('text=数値で入力してください').first()).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_CONFIRM"]')).toBeEnabled();
  expect(saveApiCalled).toBe(false);
});

// -----------------------------------------------------------------------
// TC-009: E002 — 下限 > 上限のときエラーラベル表示（確定押下時）
// -----------------------------------------------------------------------
test('TC-009: E002 — 下限が上限を超えている場合に確定押下でエラーが表示される', async ({ page }) => {
  await setupRouteMocks(page);
  await gotoAndWait(page, URL);

  // 白血球数（referenceValueDisplay=null）の下限・上限を入力
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('9999');
  await refCell.locator('input').nth(1).fill('100');

  // 全行の結果値を入力（E001 を回避）
  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');

  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('text=下限値は上限値以下で入力してください').first()).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-010: 確定フロー — バリデーション通過後にボタン非活性化（reasonRequired=false）
// -----------------------------------------------------------------------
test('TC-010: 確定フロー — バリデーション通過後にボタンが非活性化され、APIが呼ばれる', async ({ page }) => {
  let saveApiCalled = false;
  await setupRouteMocks(page);
  // setupRouteMocks より後に登録すると LIFO で優先される
  await page.route('**/bff/orders/*/test-results/save', async (route: Route) => {
    saveApiCalled = true;
    await route.fulfill({ status: 200, json: {} });
  });
  await gotoAndWait(page, URL);

  // 全行に有効な値を入力
  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');

  const savePromise = page.waitForRequest('**/bff/orders/*/test-results/save');
  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();
  await savePromise;

  await expect(page.locator('[data-ui-id="BTN_CONFIRM"]')).toBeDisabled();
  expect(saveApiCalled).toBe(true);
});

// -----------------------------------------------------------------------
// TC-011: 確定フロー — reasonRequired=true のとき修正理由ダイアログを表示
// -----------------------------------------------------------------------
test('TC-011: reasonRequired=true のとき修正理由ダイアログが表示される', async ({ page }) => {
  const mockWithReason = mockTestResults.map(r => ({ ...r, reasonRequired: true }));
  await setupRouteMocks(page, mockWithReason);
  await gotoAndWait(page, URL);

  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');

  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('[data-ui-id="RDO_EDIT_REASON"]')).toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_EDIT_REASON_CONFIRM"]')).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-012: 修正理由ダイアログ — 「その他」選択でテキストエリアが表示
// -----------------------------------------------------------------------
test('TC-012: 修正理由ダイアログ — その他選択でテキストエリアが表示される', async ({ page }) => {
  const mockWithReason = mockTestResults.map(r => ({ ...r, reasonRequired: true }));
  await setupRouteMocks(page, mockWithReason);
  await gotoAndWait(page, URL);

  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');
  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('[data-ui-id="RDO_EDIT_REASON"]')).toBeVisible();
  await page.locator('label', { hasText: 'その他' }).click();
  await expect(page.locator('[data-ui-id="TXT_EDIT_REASON"]')).toBeVisible();
});

// -----------------------------------------------------------------------
// TC-013: 修正理由ダイアログ — キャンセルで閉じ確定ボタンが再活性化
// -----------------------------------------------------------------------
test('TC-013: 修正理由ダイアログのキャンセルでダイアログが閉じ確定ボタンが再活性化される', async ({ page }) => {
  const mockWithReason = mockTestResults.map(r => ({ ...r, reasonRequired: true }));
  await setupRouteMocks(page, mockWithReason);
  await gotoAndWait(page, URL);

  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');
  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('[data-ui-id="RDO_EDIT_REASON"]')).toBeVisible();

  await page.locator('[data-ui-id="BTN_CANCEL"][data-event-id="EVT_CANCEL_DIALOG"]').click();

  await expect(page.locator('[data-ui-id="RDO_EDIT_REASON"]')).not.toBeVisible();
  await expect(page.locator('[data-ui-id="BTN_CONFIRM"]')).toBeEnabled();
});

// -----------------------------------------------------------------------
// TC-014: 修正理由ダイアログ — 理由選択後に確定でsave APIが呼ばれる
// -----------------------------------------------------------------------
test('TC-014: 修正理由ダイアログ — 理由選択後に確定で save API が呼ばれる', async ({ page }) => {
  let saveApiCalled = false;
  const mockWithReason = mockTestResults.map(r => ({ ...r, reasonRequired: true }));
  await setupRouteMocks(page, mockWithReason);
  await page.route('**/bff/orders/*/test-results/save', async (route: Route) => {
    saveApiCalled = true;
    await route.fulfill({ status: 200, json: {} });
  });
  await gotoAndWait(page, URL);

  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');
  await page.locator('[data-ui-id="BTN_CONFIRM"]').click();

  await expect(page.locator('[data-ui-id="RDO_EDIT_REASON"]')).toBeVisible();
  await page.locator('label', { hasText: '検査値の入力ミス' }).click();

  const savePromise = page.waitForRequest('**/bff/orders/*/test-results/save');
  await page.locator('[data-ui-id="BTN_EDIT_REASON_CONFIRM"]').click();
  await savePromise;

  expect(saveApiCalled).toBe(true);
});

// -----------------------------------------------------------------------
// TC-015: 確定ボタンの多重送信防止
// -----------------------------------------------------------------------
test('TC-015: 確定ボタン押下後は多重送信できない（ボタンが非活性のまま）', async ({ page }) => {
  let saveCallCount = 0;
  await setupRouteMocks(page);
  await page.route('**/bff/orders/*/test-results/save', async (route: Route) => {
    saveCallCount++;
    await route.fulfill({ status: 200, json: {} });
  });
  await gotoAndWait(page, URL);

  await page.locator('tbody tr').nth(0).locator('[data-ui-id="COL_RESULT"] input').fill('150');
  await page.locator('tbody tr').nth(1).locator('[data-ui-id="COL_RESULT"] input').fill('5000');
  const refCell = refValueNullRow(page);
  await refCell.locator('input').first().fill('100');
  await refCell.locator('input').nth(1).fill('9999');

  const confirmBtn = page.locator('[data-ui-id="BTN_CONFIRM"]');
  const savePromise = page.waitForRequest('**/bff/orders/*/test-results/save');
  await confirmBtn.click();
  await savePromise;
  await expect(confirmBtn).toBeDisabled();

  await confirmBtn.click({ force: true });
  expect(saveCallCount).toBe(1);
});
