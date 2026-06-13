export interface ValidationError {
  code: string;
  message: string;
  field: string;
}

/**
 * E001: 結果値が数値かチェック（入力中リアルタイム用・空文字は通過）
 */
export function validateResultValue(value: string): ValidationError | null {
  if (value === '') return null;
  if (isNaN(parseFloat(value)) || !/^\d*\.?\d+$/.test(value.trim())) {
    return { code: 'E001', message: '数値で入力してください', field: 'resultValue' };
  }
  return null;
}

/**
 * E001: 確定ボタン押下時の必須チェック（空文字もエラー）
 */
export function validateRequiredResultValue(value: string): ValidationError | null {
  if (value === '') {
    return { code: 'E001', message: '数値で入力してください', field: 'resultValue' };
  }
  return validateResultValue(value);
}

/**
 * E002: 下限値が上限値以下かチェック（確定ボタン押下時）
 */
export function validateLimits(lowerLimit: string, upperLimit: string): ValidationError | null {
  if (!lowerLimit || !upperLimit) return null;
  const lower = parseFloat(lowerLimit);
  const upper = parseFloat(upperLimit);
  if (!isNaN(lower) && !isNaN(upper) && lower > upper) {
    return { code: 'E002', message: '下限値は上限値以下で入力してください', field: 'lowerLimit' };
  }
  return null;
}
