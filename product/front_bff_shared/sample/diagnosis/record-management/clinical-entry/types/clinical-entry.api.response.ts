/**
 * 診療記録入力データ取得 レスポンス型
 */
export interface ClinicalEntryDataResponse {
  chiefComplaint: string;
  vitalInfo: {
    bloodPressure: string;
    bloodType: string;
    rhFactor: string;
  };
  prescriptionOrder: {
    orders: string[];
  };
}
