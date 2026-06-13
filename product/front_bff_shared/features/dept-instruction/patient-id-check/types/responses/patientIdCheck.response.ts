// BFF レスポンス型（FE/BFF 共有）— DEP009 患者取り違い防止チェック

/** GET /deptInstructions/{orderId}/patientIdCheck/expectations レスポンス */
export type GetPatientIdCheckExpectationsResponse = {
  patient: {
    id: string;
    name: string;
    kana?: string;
    birthDate: string;
    barcode: string;
  };
  item: {
    name: string;
    lotNumber?: string;
    barcode: string;
  };
  order: {
    id: string;
    orderType: string;
  };
};

/** GET /deptInstructions/patientIdCheck/reasonTemplates レスポンス */
export type GetReasonTemplatesResponse = {
  templates: Array<{ code: string; label: string }>;
};

/** GET /deptInstructions/patientIdCheck/staff/{barcode} レスポンス */
export type GetStaffByBarcodeResponse = {
  staff: {
    id: string;
    name: string;
  };
};

/** POST /deptInstructions/{orderId}/patientIdCheck/complete レスポンス */
export type PostPatientIdCheckCompleteResponse = {
  sessionId: string;
  completedAt: string;
  recordedAt: string;
};

/** POST /deptInstructions/{orderId}/patientIdCheck/confirmReason レスポンス */
export type PostPatientConfirmReasonResponse = {
  reasonId: string;
  savedAt: string;
};
