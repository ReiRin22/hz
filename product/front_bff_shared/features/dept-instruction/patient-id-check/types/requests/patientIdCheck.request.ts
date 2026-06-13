// BFF リクエスト型（FE/BFF 共有）— DEP009 患者取り違い防止チェック

/** GET /deptInstructions/{orderId}/patientIdCheck/expectations クエリパラメータ（なし） */
export type GetPatientIdCheckExpectationsRequest = {
  orderId: string;
};

/** GET /deptInstructions/patientIdCheck/reasonTemplates クエリパラメータ（なし） */
export type GetReasonTemplatesRequest = Record<string, never>;

/** GET /deptInstructions/patientIdCheck/staff/{barcode} パスパラメータ */
export type GetStaffByBarcodeRequest = {
  barcode: string;
};

/** POST /deptInstructions/{orderId}/patientIdCheck/complete リクエストボディ */
export type PostPatientIdCheckCompleteRequest = {
  orderId: string;
  patientBarcodeRead?: string;
  itemBarcodeRead?: string;
  practitionerBarcodeRead?: string;
  patientVisualConfirmed?: boolean;
  patientConfirmer: 'PERSON' | 'PROXY' | 'TWO_STAFF' | 'OTHER';
  patientConfirmReason?: {
    presetCode?: string;
    customText?: string;
  };
  itemVisualConfirmed?: boolean;
  manualPractitionerId?: string;
  checkedBy: string;
  completedAt: string;
};

/** POST /deptInstructions/{orderId}/patientIdCheck/confirmReason リクエストボディ */
export type PostPatientConfirmReasonRequest = {
  orderId: string;
  presetCode?: string;
  customText?: string;
  savedBy: string;
  timestamp: string;
};
