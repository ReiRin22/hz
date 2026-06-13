import type { Drug } from './drug.type';

/**
 * 処方アイテム（構造化）
 */
export interface PrescriptionItem {
  patientId: string;    // 患者ID
  orderId: string;      // オーダーID
  drug: Drug;           // 薬剤情報
  frequency: string;    // 頻度
  timing: string;       // タイミング
  duration: string;     // 日数
}

/**
 * 処方箋 レスポンス型（内部用）
 */
export interface PrescriptionOrderData {
  orders: PrescriptionItem[];
}
