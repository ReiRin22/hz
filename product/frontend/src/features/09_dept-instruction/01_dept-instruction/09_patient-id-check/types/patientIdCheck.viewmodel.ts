// DEP009 患者取り違い防止チェック — ViewModel 型定義・定数

export const CONFIRMER_TYPES = ['PERSON', 'PROXY', 'TWO_STAFF', 'OTHER'] as const;
export type ConfirmerType = (typeof CONFIRMER_TYPES)[number];

export const MATCH_RESULTS = ['OK', 'NG'] as const;
export type MatchResult = (typeof MATCH_RESULTS)[number];

export interface ExpectationsPatient {
  id: string;
  name: string;
  kana?: string;
  birthDate: string;
  barcode: string;
}

export interface ExpectationsItem {
  name: string;
  lotNumber?: string;
  barcode: string;
}

export interface ExpectationsOrder {
  id: string;
  orderType: string;
}

export interface Expectations {
  patient: ExpectationsPatient;
  item: ExpectationsItem;
  order: ExpectationsOrder;
}

export interface ReasonTemplate {
  code: string;
  label: string;
}

export interface StaffInfo {
  id: string;
  name: string;
}

export interface ScannedBarcode {
  value: string;
  matchResult: MatchResult | null;
}

export interface ScannedPractitioner {
  value: string;
  staffName: string | null;
}

export interface PatientConfirmReason {
  presetCode?: string;
  customText?: string;
}

export interface PatientIdCheckResult {
  sessionId: string;
  completedAt: string;
  recordedAt: string;
}
