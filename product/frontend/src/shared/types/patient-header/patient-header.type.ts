"use client";
/**
 * ETC003 患者情報ヘッダ表示 - ViewModel型定義
 * UI表示に特化した型。BFFレスポンス型とは分離して管理する。
 */

/** 患者情報ViewModel（UI表示用） */
export interface PatientViewModel {
  patientId: string;
  name: string;
  kana: string;
  birthDate: string;
  gender: string;
  age: number;
  department: string;
  ward: string;
  room: string;
  doctor: string;
  allergies: string[];
  infections: string[];
  consultationStatus: "waiting" | "in-progress" | "completed" | "postponed" | "cancelled";
  prescriptionStatus: "electronic" | "paper" | "disconnected";
  admissionType?: "inpatient" | "outpatient";
  radiationExposure?: {
    dose: number;
    unit: string;
    level: "low" | "moderate" | "high";
  };
  lastExamination?: {
    date: string;
    type: string;
  };
  medicalInfoSharing: {
    status: "full-consent" | "partial-consent" | "no-consent";
    consentDate?: string;
    expiryDate?: string;
    lastUpdated?: string;
    details?: {
      emergencyMedicalInfo?: boolean;
      prescriptionHistory?: boolean;
      diagnosticImages?: boolean;
      labResults?: boolean;
      referralLetters?: boolean;
    };
  };
  /** 新患フラグ（過去の診療記録なし） */
  isNewPatient: boolean;
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
}

/** 検査結果ViewModel（患者ヘッダー表示用・サマリ） */
export interface TestResultViewModel {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

/** ダイアログ開閉状態 */
export interface PatientHeaderDialogState {
  patientDetail: boolean;
  medicationHistory: boolean;
  testResults: boolean;
  imageViewer: boolean;
  diagnosisRegistration: boolean;
  patientSearch: boolean;
  prescriptionSettings: boolean;
  medicalInfoSharing: boolean;
  patientMemo: boolean;
  proxyInputConfirm: boolean;
}

/** 患者ヘッダーのUI状態 */
export interface PatientHeaderUIState {
  /** ダイアログ開閉状態 */
  dialogs: PatientHeaderDialogState;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー状態 */
  error: string | null;
}
