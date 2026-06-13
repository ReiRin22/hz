/**
 * 薬剤情報（drug_masterから取得）
 */
export interface Drug {
  drugId: string;       // 薬剤ID
  drugName: string;     // 薬名（用量含む）例: "ロキソプロフェン錠 60mg"
  drugPrice: number;    // 薬価（円）
  drugCategory: string; // 薬効分類
}
