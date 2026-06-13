/**
 * PHI (Protected Health Information) 検出パターン
 * フロントエンド・BFF 共通で使用
 */

/**
 * 患者ID検証パターン
 */
export const PATIENT_ID_PATTERN = /^P\d{8}$/;

/**
 * 医師ID検証パターン
 */
export const DOCTOR_ID_PATTERN = /^D\d{6}$/;

/**
 * 看護師ID検証パターン
 */
export const NURSE_ID_PATTERN = /^N\d{6}$/;

/**
 * スタッフID検証パターン（汎用）
 */
export const STAFF_ID_PATTERN = /^[A-Z]\d{6}$/;

/**
 * 電話番号検証パターン（ハイフンあり・なし両対応）
 */
export const PHONE_PATTERN = /^0\d{1,4}-?\d{1,4}-?\d{4}$/;

/**
 * 郵便番号検証パターン
 */
export const POSTAL_CODE_PATTERN = /^\d{3}-?\d{4}$/;

/**
 * メールアドレス検証パターン
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 日本の保険証番号パターン（8桁）
 */
export const INSURANCE_NUMBER_PATTERN = /^\d{8}$/;

/**
 * PHI フィールド名パターン（ログマスキング用）
 */
export const PHI_FIELD_NAMES = [
  'patientName',
  'patientKana',
  'address',
  'phoneNumber',
  'email',
  'insuranceNumber',
  'familyName',
  'givenName',
  'birthDate',
  'ssn',
  'medicalRecordNumber',
] as const;

export type PhiFieldName = (typeof PHI_FIELD_NAMES)[number];

/**
 * PHI フィールドかどうかを判定
 */
export function isPhiField(fieldName: string): boolean {
  return PHI_FIELD_NAMES.includes(fieldName as PhiFieldName);
}

/**
 * オブジェクトから PHI フィールドをマスキング
 */
export function maskPhiFields<T extends Record<string, unknown>>(obj: T): T {
  const masked = { ...obj };
  for (const key in masked) {
    if (isPhiField(key)) {
      masked[key] = '***MASKED***' as T[Extract<keyof T, string>];
    }
  }
  return masked;
}
