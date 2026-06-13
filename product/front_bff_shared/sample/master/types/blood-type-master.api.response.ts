/**
 * 血液型マスタ取得 レスポンス型
 */
export interface BloodTypeOption {
  value: string;
  label: string;
}

export interface BloodTypeMasterResponse {
  bloodTypes: BloodTypeOption[];
  rhFactors: BloodTypeOption[];
}
