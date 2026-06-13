/**
 * ETC003 患者情報ヘッダ表示用のBFFレスポンス型
 * 患者ヘッダーに表示する情報を含む詳細レスポンス
 */

/** 患者ヘッダー表示用レスポンス */
export interface PatientHeaderResponse {
  /** 患者ID */
  patientId: string;
  /** 患者氏名 */
  name: string;
  /** 患者氏名（カナ） */
  kana: string;
  /** 生年月日（YYYY-MM-DD） */
  birthDate: string;
  /** 性別 */
  gender: string;
  /** 年齢 */
  age: number;
  /** 診療科 */
  department: string;
  /** 病棟 */
  ward: string;
  /** 病室 */
  room: string;
  /** 担当医 */
  doctor: string;
  /** アレルギー一覧 */
  allergies: string[];
  /** 感染症一覧 */
  infections: string[];
  /** 診察ステータス */
  consultationStatus: "waiting" | "in-progress" | "completed" | "postponed" | "cancelled";
  /** 処方箋ステータス */
  prescriptionStatus: "electronic" | "paper" | "disconnected";
  /** 入院/外来区分 */
  admissionType?: "inpatient" | "outpatient";
  /** 新患フラグ（過去の診療記録なし） */
  isNewPatient?: boolean;
  /** 放射線被爆量 */
  radiationExposure?: {
    dose: number;
    unit: string;
    level: "low" | "moderate" | "high";
  };
  /** 最終検査情報 */
  lastExamination?: {
    date: string;
    type: string;
  };
  /** 医療情報共有設定 */
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
  /** 保険情報 */
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
}

/** 患者検索結果レスポンス */
export interface PatientSearchResultResponse {
  /** 患者一覧 */
  patients: PatientHeaderResponse[];
  /** 合計件数 */
  total: number;
}

/** 検査結果サマリ（患者ヘッダー用） */
export interface PatientTestResultSummaryResponse {
  /** 検査名 */
  name: string;
  /** 検査値 */
  value: string;
  /** 単位 */
  unit: string;
  /** 基準範囲 */
  normalRange: string;
  /** 異常フラグ */
  isAbnormal: boolean;
}
