/**
 * ImagingExaminationScheduling - 定数データ
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingExaminationScheduling.constants.ts
 */

// カテゴリIDから検査種別名へのマッピング
export const categoryLabels: Record<string, string> = {
  xray: 'X線撮影',
  ct: 'CT検査',
  mri: 'MRI検査',
  ultrasound: '超音波検査',
  dexa: '骨密度測定',
  fluoroscopy: '透視検査'
};
