/** 検査項目マスタ1件 */
export type TestItemRecord = {
  code: string;
  name: string;
  unit_id: string;
  lower_limit: number | null;
  upper_limit: number | null;
  critical_lower: number | null;
  critical_upper: number | null;
};

/** GET /bff/testItem/lists レスポンス */
export type TestItemListResponse = {
  items: TestItemRecord[];
};

/** BFF統一エラーレスポンス */
export type MasterBffErrorResponse = {
  type: 'AUTH_ERROR' | 'SYSTEM_ERROR';
  code: string;
};
