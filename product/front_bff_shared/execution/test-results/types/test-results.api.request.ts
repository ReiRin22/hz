/** 検査結果保存 リクエストボディ1件 */
export type TestResultSaveItem = {
  itemCode: string;
  resultValue: number;
  unit: string;
  lowerLimit?: number | undefined;
  upperLimit?: number | undefined;
  testDate?: string | undefined;
};

/** 修正理由 入力 */
export type ModificationReasonInput = {
  reasonCode: string;
  reasonText?: string | undefined;
};

/** POST /bff/orders/{orderUuid}/testResults/save リクエストボディ */
export type TestResultSaveRequest = {
  testResults: TestResultSaveItem[];
  modificationReason?: ModificationReasonInput | undefined;
};
