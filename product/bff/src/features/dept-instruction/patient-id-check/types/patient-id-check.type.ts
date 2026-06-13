/** BE（ASP.NET mock）から返される生データ型 */

export interface UpstreamPatientIdCheckExpectations {
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
}

export interface UpstreamReasonTemplates {
  templates: Array<{ code: string; label: string }>;
}

export interface UpstreamStaffByBarcode {
  staff: {
    id: string;
    name: string;
  };
}

export interface UpstreamPatientIdCheckComplete {
  sessionId: string;
  completedAt: string;
  recordedAt: string;
}

export interface UpstreamPatientConfirmReason {
  reasonId: string;
  savedAt: string;
}
