/**
 * 患者情報関連のBFFリクエスト型
 * ETC003 患者情報ヘッダ表示で使用
 */

/** 患者検索リクエスト */
export type PatientSearchRequest = {
  /** 検索キーワード（患者名・患者IDの部分一致） */
  query: string;
  /** 取得件数上限（デフォルト20） */
  limit?: number;
};

/** 患者詳細情報取得リクエスト */
export type PatientDetailRequest = {
  /** 患者ID */
  patientId: string;
};

/** 処方箋発行形態変更リクエスト */
export type PrescriptionStatusUpdateRequest = {
  /** 患者ID */
  patientId: string;
  /** 変更後の処方箋ステータス */
  status: "electronic" | "paper" | "disconnected";
};

/** 医療情報共有設定変更リクエスト */
export type MedicalInfoSharingUpdateRequest = {
  /** 患者ID */
  patientId: string;
  /** 同意ステータス */
  status: "full-consent" | "partial-consent" | "no-consent";
  /** 同意有効期限 */
  expiryDate?: string;
  /** 詳細同意設定 */
  details?: {
    emergencyMedicalInfo?: boolean;
    prescriptionHistory?: boolean;
    diagnosticImages?: boolean;
    labResults?: boolean;
    referralLetters?: boolean;
  };
};
