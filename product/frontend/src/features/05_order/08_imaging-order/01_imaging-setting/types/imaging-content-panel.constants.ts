/**
 * ImagingContentPanel 定数データ
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingContentPanel.constants.ts
 */

export const bodyPartsByCategory: Record<string, string[]> = {
  xray: ['胸部', '腹部', '頚椎', '胸椎', '腰椎', '肩関節', '肘関節', '手関節', '手', '股関節', '膝関節', '足関節', '足'],
  ct: ['頭部', '頚部', '胸部', '腹部', '骨盤', '脊椎', '四肢'],
  mri: ['頭部', '頭部MRA', '頚椎', '胸椎', '腰椎', '肩関節', '膝関節', '腹部', '骨盤'],
  ultrasound: ['腹部', '肝臓', '胆嚢', '腎臓', '甲状腺', '心臓（心エコー）', '頚動脈', '乳腺'],
  dexa: ['腰椎', '大腿骨', '全身'],
  fluoroscopy: ['上部消化管', '下部消化管', '食道'],
};

export const directionsByCategory: Record<string, string[]> = {
  xray: ['AP', 'PA', 'LAT', 'Oblique', '両方向'],
  ct: ['Plain', 'Enhanced', 'CTA', '3D'],
  mri: ['T1WI', 'T2WI', 'FLAIR', 'DWI', 'MRA', '造影T1'],
  ultrasound: ['Standard'],
  dexa: ['Standard'],
  fluoroscopy: ['AP', 'PA', 'LAT'],
};

export const categoryOptions = [
  { value: 'xray', label: 'X線撮影' },
  { value: 'ct', label: 'CT検査' },
  { value: 'mri', label: 'MRI検査' },
  { value: 'ultrasound', label: '超音波検査' },
  { value: 'dexa', label: 'DEXA（骨密度検査）' },
  { value: 'fluoroscopy', label: '透視検査' },
];

export const radiationConditionDefaults: Record<string, Record<string, string>> = {
  xray: {
    '胸部': '80kV, 3.2mAs',
    '腹部': '75kV, 50mAs',
    '頚椎': '70kV, 20mAs',
    '胸椎': '75kV, 30mAs',
    '腰椎': '80kV, 40mAs',
    '肩関節': '70kV, 10mAs',
    '肘関節': '60kV, 5mAs',
    '手関節': '55kV, 4mAs',
    '手': '50kV, 3mAs',
    '股関節': '75kV, 25mAs',
    '膝関節': '65kV, 10mAs',
    '足関節': '60kV, 5mAs',
    '足': '55kV, 4mAs',
  },
  ct: {
    '頭部': '120kV, 300mAs',
    '頚部': '120kV, 200mAs',
    '胸部': '120kV, 150mAs',
    '腹部': '120kV, 200mAs',
    '骨盤': '120kV, 250mAs',
    '脊椎': '120kV, 200mAs',
    '四肢': '120kV, 150mAs',
  },
  mri: {
    '頭部': 'T1: 500/15, T2: 4000/100',
    '頭部MRA': 'TOF法 TR/TE: 25/3.5',
    '頚椎': 'T1: 600/15, T2: 3500/100',
    '胸椎': 'T1: 600/15, T2: 3500/100',
    '腰椎': 'T1: 600/15, T2: 3500/100',
    '肩関節': 'T1: 600/15, T2: 3500/80',
    '膝関節': 'T1: 600/15, T2: 3500/80',
    '腹部': 'T1: 150/2.3, T2: 1000/80',
    '骨盤': 'T1: 600/15, T2: 4000/100',
  },
  ultrasound: {
    '腹部': '3.5MHz, ゲイン60dB',
    '肝臓': '3.5MHz, ゲイン60dB',
    '胆嚢': '3.5MHz, ゲイン60dB',
    '腎臓': '3.5MHz, ゲイン60dB',
    '甲状腺': '7.5MHz, ゲイン55dB',
    '心臓（心エコー）': '2.5MHz, ゲイン60dB',
    '頚動脈': '7.5MHz, ゲイン55dB',
    '乳腺': '7.5MHz, ゲイン55dB',
  },
  dexa: {
    '腰椎': 'L1-L4, 標準モード',
    '大腿骨': '大腿骨頚部, 標準モード',
    '全身': '全身スキャン, 低線量モード',
  },
  fluoroscopy: {
    '上部消化管': '90kV, 3mA, パルスレート15fps',
    '下部消化管': '90kV, 3mA, パルスレート15fps',
    '食道': '90kV, 3mA, パルスレート15fps',
  },
};

export const functionalConditionsByCategory: Record<string, string[]> = {
  xray: ['造影あり', '造影なし', '荷重位で撮影', '吸気時に撮影', '呼気時に撮影', '最大吸気位', '最大呼気位'],
  ct: [
    '造影あり', '造影なし（単純CT）', '呼吸停止下で撮影', '造影前後で撮影', '造影後のみ',
    '3D再構成を含む', 'MPR（多断面再構成）', 'MIP（最大値投影）', 'MinIP（最小値投影）',
    'VR（ボリュームレンダリング）', '薄いスライスで撮影', '動脈相・静脈相の撮影', '遅延相を含む', '冠状断・矢状断も作成',
  ],
  mri: [
    '造影あり', '造影なし', '造影前後で撮影', '造影後のみ', '呼吸同期を使用',
    '脂肪抑制を含む', 'T1強調画像', 'T2強調画像', 'FLAIR画像',
    'DWI（拡散強調画像）', 'MRA（血管撮影）', '全身MRI', '機能的MRI',
  ],
  ultrasound: [
    '絶食後に実施', '充満膀胱で実施', '呼吸停止下で観察', 'カラードップラーを使用',
    'パルスドップラーを使用', 'エラストグラフィを含む', '体位変換を含む', '圧迫法を使用', '負荷試験を含む',
  ],
  dexa: ['腰椎で測定', '大腿骨で測定', '前腕で測定', '全身測定', '体組成分析を含む'],
  fluoroscopy: ['造影あり', '造影なし', '体位変換を含む', '圧迫法を使用', '二重造影法', '動画記録を含む', 'スポット撮影を含む'],
};

export const presetsByCategory: Record<string, {
  id: string;
  name: string;
  description: string;
  bodyParts: string;
  directions: string[];
  laterality: string[];
  radiationCondition: string;
  positions: string[];
  functionalConditions: string[];
}[]> = {
  xray: [
    { id: 'xray1', name: '胸部', description: '方向: PA LAT\n体位: 立位', bodyParts: '胸部', directions: ['PA', 'LAT'], laterality: ['Not specified'], radiationCondition: '80kV, 3.2mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray2', name: '腹部', description: '方向: AP LAT\n体位: 臥位', bodyParts: '腹部', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '75kV, 50mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'xray3', name: '頚椎', description: '方向: AP LAT\n体位: 立位', bodyParts: '頚椎', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '70kV, 20mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray4', name: '胸椎', description: '方向: AP LAT\n体位: 立位', bodyParts: '胸椎', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '75kV, 30mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray5', name: '腰椎', description: '方向: AP LAT\n体位: 立位', bodyParts: '腰椎', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '80kV, 40mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray6', name: '肩関節', description: '方向: AP\n体位: 立位', bodyParts: '肩関節', directions: ['AP'], laterality: ['Not specified'], radiationCondition: '70kV, 10mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray7', name: '肘関節', description: '方向: AP LAT\n体位: 座位', bodyParts: '肘関節', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '60kV, 5mAs', positions: ['座位'], functionalConditions: [] },
    { id: 'xray8', name: '手関節', description: '方向: AP Oblique\n体位: 座位', bodyParts: '手関節', directions: ['AP', 'Oblique'], laterality: ['Not specified'], radiationCondition: '55kV, 4mAs', positions: ['座位'], functionalConditions: [] },
    { id: 'xray9', name: '手', description: '方向: AP Oblique\n体位: 座位', bodyParts: '手', directions: ['AP', 'Oblique'], laterality: ['Not specified'], radiationCondition: '50kV, 3mAs', positions: ['座位'], functionalConditions: [] },
    { id: 'xray10', name: '股関節', description: '方向: AP LAT\n体位: 臥位', bodyParts: '股関節', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '75kV, 25mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'xray11', name: '膝関節', description: '方向: AP LAT\n体位: 立位', bodyParts: '膝関節', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '65kV, 10mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray12', name: '足関節', description: '方向: AP LAT\n体位: 立位', bodyParts: '足関節', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '60kV, 5mAs', positions: ['立位'], functionalConditions: [] },
    { id: 'xray13', name: '足', description: '方向: AP Oblique\n体位: 立位', bodyParts: '足', directions: ['AP', 'Oblique'], laterality: ['Not specified'], radiationCondition: '55kV, 4mAs', positions: ['立位'], functionalConditions: [] },
  ],
  ct: [
    { id: 'ct1', name: '頭部', description: '方向: Plain\n体位: 臥位', bodyParts: '頭部', directions: ['Plain'], laterality: ['Not specified'], radiationCondition: '120kV, 300mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'ct2', name: '頭部造影', description: '方向: Enhanced\n体位: 臥位', bodyParts: '頭部', directions: ['Enhanced'], laterality: ['Not specified'], radiationCondition: '120kV, 300mAs', positions: ['臥位'], functionalConditions: ['造影あり'] },
    { id: 'ct3', name: '頚部', description: '方向: Plain\n体位: 臥位', bodyParts: '頚部', directions: ['Plain'], laterality: ['Not specified'], radiationCondition: '120kV, 200mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'ct4', name: '胸部', description: '方向: Plain\n体位: 臥位', bodyParts: '胸部', directions: ['Plain'], laterality: ['Not specified'], radiationCondition: '120kV, 150mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'ct5', name: '腹部', description: '方向: Plain\n体位: 臥位', bodyParts: '腹部', directions: ['Plain'], laterality: ['Not specified'], radiationCondition: '120kV, 200mAs', positions: ['臥位'], functionalConditions: [] },
    { id: 'ct6', name: '腹部造影', description: '方向: Enhanced\n体位: 臥位', bodyParts: '腹部', directions: ['Enhanced'], laterality: ['Not specified'], radiationCondition: '120kV, 200mAs', positions: ['臥位'], functionalConditions: ['造影あり', '動脈相・静脈相の撮影'] },
  ],
  mri: [
    { id: 'mri1', name: '頭部', description: '方向: T1WI T2WI\n体位: 臥位', bodyParts: '頭部', directions: ['T1WI', 'T2WI'], laterality: ['Not specified'], radiationCondition: 'T1: 500/15, T2: 4000/100', positions: ['臥位'], functionalConditions: [] },
    { id: 'mri2', name: '頭部MRA', description: '方向: MRA\n体位: 臥位', bodyParts: '頭部MRA', directions: ['MRA'], laterality: ['Not specified'], radiationCondition: 'TOF法 TR/TE: 25/3.5', positions: ['臥位'], functionalConditions: [] },
    { id: 'mri3', name: '頚椎', description: '方向: T1WI T2WI\n体位: 臥位', bodyParts: '頚椎', directions: ['T1WI', 'T2WI'], laterality: ['Not specified'], radiationCondition: 'T1: 600/15, T2: 3500/100', positions: ['臥位'], functionalConditions: [] },
    { id: 'mri4', name: '腰椎', description: '方向: T1WI T2WI\n体位: 臥位', bodyParts: '腰椎', directions: ['T1WI', 'T2WI'], laterality: ['Not specified'], radiationCondition: 'T1: 600/15, T2: 3500/100', positions: ['臥位'], functionalConditions: [] },
    { id: 'mri5', name: '肩関節', description: '方向: T1WI T2WI\n体位: 臥位', bodyParts: '肩関節', directions: ['T1WI', 'T2WI'], laterality: ['Not specified'], radiationCondition: 'T1: 600/15, T2: 3500/80', positions: ['臥位'], functionalConditions: [] },
    { id: 'mri6', name: '膝関節', description: '方向: T1WI T2WI\n体位: 臥位', bodyParts: '膝関節', directions: ['T1WI', 'T2WI'], laterality: ['Not specified'], radiationCondition: 'T1: 600/15, T2: 3500/80', positions: ['臥位'], functionalConditions: [] },
  ],
  ultrasound: [
    { id: 'ultrasound1', name: '腹部', description: '方向: Standard\n体位: 臥位', bodyParts: '腹部', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '3.5MHz, ゲイン60dB', positions: ['臥位'], functionalConditions: ['絶食後に実施'] },
    { id: 'ultrasound2', name: '肝臓', description: '方向: Standard\n体位: 臥位', bodyParts: '肝臓', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '3.5MHz, ゲイン60dB', positions: ['臥位'], functionalConditions: ['絶食後に実施'] },
    { id: 'ultrasound3', name: '胆嚢', description: '方向: Standard\n体位: 臥位', bodyParts: '胆嚢', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '3.5MHz, ゲイン60dB', positions: ['臥位'], functionalConditions: ['絶食後に実施'] },
    { id: 'ultrasound4', name: '腎臓', description: '方向: Standard\n体位: 臥位', bodyParts: '腎臓', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '3.5MHz, ゲイン60dB', positions: ['臥位'], functionalConditions: [] },
    { id: 'ultrasound5', name: '甲状腺', description: '方向: Standard\n体位: 臥位', bodyParts: '甲状腺', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '7.5MHz, ゲイン55dB', positions: ['臥位'], functionalConditions: [] },
    { id: 'ultrasound6', name: '心臓', description: '方向: Standard\n体位: 側臥位', bodyParts: '心臓（心エコー）', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '2.5MHz, ゲイン60dB', positions: ['側臥位'], functionalConditions: [] },
  ],
  dexa: [
    { id: 'dexa1', name: '腰椎', description: '方向: Standard\n体位: 臥位', bodyParts: '腰椎', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: 'L1-L4, 標準モード', positions: ['臥位'], functionalConditions: [] },
    { id: 'dexa2', name: '大腿骨', description: '方向: Standard\n体位: 臥位', bodyParts: '大腿骨', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '大腿骨頚部, 標準モード', positions: ['臥位'], functionalConditions: [] },
    { id: 'dexa3', name: '全身', description: '方向: Standard\n体位: 臥位', bodyParts: '全身', directions: ['Standard'], laterality: ['Not specified'], radiationCondition: '全身スキャン, 低線量モード', positions: ['臥位'], functionalConditions: [] },
  ],
  fluoroscopy: [
    { id: 'fluoroscopy1', name: '上部消化管', description: '方向: AP\n体位: 立位', bodyParts: '上部消化管', directions: ['AP'], laterality: ['Not specified'], radiationCondition: '90kV, 3mA, パルスレート15fps', positions: ['立位'], functionalConditions: ['造影あり', '体位変換を含む'] },
    { id: 'fluoroscopy2', name: '下部消化管', description: '方向: AP\n体位: 立位', bodyParts: '下部消化管', directions: ['AP'], laterality: ['Not specified'], radiationCondition: '90kV, 3mA, パルスレート15fps', positions: ['立位'], functionalConditions: ['造影あり', '体位変換を含む'] },
    { id: 'fluoroscopy3', name: '食道', description: '方向: AP LAT\n体位: 立位', bodyParts: '食道', directions: ['AP', 'LAT'], laterality: ['Not specified'], radiationCondition: '90kV, 3mA, パルスレート15fps', positions: ['立位'], functionalConditions: ['造影あり'] },
  ],
};
