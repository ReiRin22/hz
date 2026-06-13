/**
 * ImagingOrderDetailPanel - 定数データ
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingOrderDetailPanel.constants.ts
 */

// モダリティオプション
export const modalityOptions = [
  { value: 'xray', label: 'X線' },
  { value: 'ct', label: 'CT' },
  { value: 'mri', label: 'MRI' },
  { value: 'ultrasound', label: '超音波' },
  { value: 'dexa', label: 'DEXA（骨密度）' },
  { value: 'fluoroscopy', label: '透視' }
];

// 症状タグ
export const symptomTagOptions = [
  '発熱', '外傷', '疼痛', '呼吸困難', '骨折疑い', '腫瘤', '出血',
  '感染疑い', '腫瘍疑い', '経過観察', '術前評価', 'スクリーニング'
];

// 撮影方向オプション
export const protocolOptions: Record<string, string[]> = {
  xray: ['AP', 'PA', 'LL', 'RL', 'LAT'],
  ct: ['AP', 'PA', 'LL', 'RL', 'LAT', '3D'],
  mri: ['T1', 'T2', 'FLAIR', 'DWI'],
  ultrasound: ['AP', 'PA', 'LL', 'RL', 'LAT'],
  dexa: ['AP', 'PA'],
  fluoroscopy: ['AP', 'PA', 'LL', 'RL', 'LAT']
};

// 側性オプション
export const lateralityOptions = [
  { value: 'none', label: '指定なし' },
  { value: 'bilateral', label: '両側' },
  { value: 'left', label: '左' },
  { value: 'right', label: '右' }
];

// 検査種別ごとの特別指示候補
export const specialInstructionsByCategory: Record<string, string[]> = {
  xray: [
    '体動困難のため介助が必要',
    'ペースメーカー留置あり',
    '妊娠の可能性あり',
    '体位変換困難',
    '意思疎通困難',
    '聴力低下あり',
    '視力低下あり',
    '車椅子使用中',
    'ストレッチャー使用',
    '酸素投与中',
    '点滴施行中'
  ],
  ct: [
    '体動困難のため介助が必要',
    'ペースメーカー留置あり',
    '造影剤アレルギーあり',
    '金属製インプラントあり',
    '妊娠の可能性あり',
    '閉所恐怖症',
    '呼吸停止困難',
    '体位保持困難',
    '意思疎通困難',
    '小児のため鎮静が必要',
    '点滴ライン確保済み',
    '腎機能低下あり',
    '喘息の既往あり'
  ],
  mri: [
    '体動困難のため介助が必要',
    'ペースメーカー留置あり（MRI対応）',
    '金属製インプラントあり',
    '人工内耳あり',
    '閉所恐怖症',
    '刺青あり',
    '体位保持困難',
    '意思疎通困難',
    '小児のため鎮静が必要',
    '体内金属片の既往あり'
  ],
  ultrasound: [
    '体動困難のため介助が必要',
    '体位変換困難',
    '腹部手術の既往あり',
    '絶食・絶飲中',
    '意思疎通困難',
    '圧痛あり',
    '腹水貯留あり',
    'ドレーン留置中'
  ],
  dexa: [
    '体動困難のため介助が必要',
    '妊娠の可能性あり',
    '体位保持困難',
    '脊椎手術の既往あり',
    '骨折の既往あり',
    '測定部位に金属あり'
  ],
  fluoroscopy: [
    '体動困難のため介助が必要',
    '妊娠の可能性あり',
    '嚥下困難あり',
    '誤嚥のリスクあり',
    '意思疎通困難',
    '体位変換困難',
    'バリウムアレルギーあり',
    '消化管穿孔のリスクあり'
  ]
};

