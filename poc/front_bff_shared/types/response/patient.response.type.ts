/**
 * カルテドメインサービスから返却される、およびBFFからフロントへ返却される
 * 患者情報の共通レスポンス型
 */
export interface PatientResponse {
  /** 患者ID */
  id: number;
  
  /** 患者氏名 */
  name: string;
  
  /** 患者コード (例: P-TENANT_A-001) */
  patientCode: string;
  
  /** * 保存されている顔写真の相対パス 
   * (例: /uploads/tenant_a/1/face_photo.jpg)
   * まだ画像がない場合は null
   */
  imagePath: string | null;

  /** BFFで変換したブラウザ表示用UR */
  fullImagePath?: string | null;

  /** 作成日時（必要に応じて） */
  createdAt?: string;
}