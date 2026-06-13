/**
 * バイタル情報 レスポンス型（VitalInfoエンティティに対応）
 */
export interface VitalInfoData {
  id: number;
  patientId: string;
  bloodPressure: string | null;
  bloodType: string | null;
  rhFactor: string | null;
  recordedAt: string;
}
