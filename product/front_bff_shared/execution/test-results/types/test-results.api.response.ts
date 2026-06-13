/** 検査結果1件 */
export type TestResultItem = {
  itemCode: string;
  itemName: string;
  resultValue: number | null;
  unit: string;
  referenceValueDisplay: string | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  criticalLower: number | null;
  criticalUpper: number | null;
  previousResultValue: number | null;
  hasPreviousResult: boolean;
  testDate: string | null;
  hasTestDate: boolean;
  isUserAdded: boolean;
};

/** 編集ロック情報 */
export type LockInfo = {
  lockBy: 'SELF' | 'OTHER';
  lockedAt: string;
  lockedByUserId: string;
  lockedByUserName: string;
};

/** 単位マスタ */
export type UnitOption = {
  value: string;
  label: string;
};

/** POST /bff/orders/{orderUuid}/testResults レスポンス */
export type TestResultsInitialResponse = {
  orderUuid: string;
  testResults: TestResultItem[];
  lockInfo: LockInfo;
  reasonRequired: boolean;
  availableUnits: UnitOption[];
};

/** 検査項目マスタ1件（検索ダイアログ用） */
export type TestItemOption = {
  itemCode: string;
  itemName: string;
  defaultUnit: string;
  referenceValueDisplay: string | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  criticalLower: number | null;
  criticalUpper: number | null;
};

/** GET /bff/testItems レスポンス */
export type TestItemSearchResponse = {
  items: TestItemOption[];
};

/** 修正理由マスタ1件 */
export type ModificationReasonOption = {
  code: string;
  label: string;
};

/** GET /bff/modificationReason レスポンス */
export type ModificationReasonResponse = {
  reasons: ModificationReasonOption[];
};

/** POST /bff/orders/{orderUuid}/testResults/save レスポンス */
export type TestResultSaveResponse = {
  orderUuid: string;
  savedAt: string;
};

/** BFF統一エラーレスポンス */
export type BffErrorResponse = {
  type: 'AUTH_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'BUSINESS_ERROR' | 'SYSTEM_ERROR';
  code: string;
  lockedByUserName?: string;
};
