/**
 * 主訴 レスポンス型（ChiefComplaintエンティティに対応）
 */
export interface ChiefComplaintData {
  id: number;
  patientId: string;
  text: string;
  recordedAt: string;
}
