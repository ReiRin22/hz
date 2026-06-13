import type { Order, Allergy, Contraindication } from '../types';

const mockAllergies: Allergy[] = [
  {
    id: 'a1',
    component: 'ペニシリン系抗生物質',
    severity: '重度',
    symptoms: '呼吸困難、発疹',
    registeredDate: '2024/03/15',
    source: '本人申告'
  },
  {
    id: 'a2',
    component: '造影剤',
    severity: '中等度',
    symptoms: '発疹、かゆみ',
    registeredDate: '2024/06/20',
    source: '医師記録'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-029',
    status: '指示受済',
    patientId: 'P00012370',
    patientName: '田辺 正雄',
    patientKana: 'タナベ マサオ',
    gender: '男',
    birthDate: '1960/02/15',
    age: 65,
    height: 168,
    weight: 62.3,
    orderType: '透析',
    content: `【依頼種別】新規導入
【緊急度】至急
【透析種別】血液透析（HD） 4時間
【導入理由】慢性腎不全（CKD G5）、尿毒症症状出現
【アクセス】内シャント（AVF）左前腕 2023/05/10作成
【感染症】HCV陽性（隔離不要）`,
    allergies: [
      {
        id: 'ALG029-1',
        component: 'ヘパリン',
        severity: '中等度',
        symptoms: '発疹、掻痒感',
        registeredDate: '2020/05/10',
        source: '医師記録'
      }
    ],
    hasAllergies: true,
    hasContraindications: true,
    location: '外来',
    department: '腎臓内科',
    attendingDoctor: '佐藤 健一',
    receivedAt: '2025/10/15 08:30',
    statusHistory: [
      {
        status: '指示受済',
        timestamp: '2025/10/15 08:30',
        updatedBy: 'システム'
      }
    ]
  },
  {
    id: 'ORD-031',
    status: '実施済',
    patientId: 'P00012372',
    patientName: '山口 健太郎',
    patientKana: 'ヤマグチ ケンタロウ',
    gender: '男',
    birthDate: '1955/09/22',
    age: 70,
    height: 172,
    weight: 58.9,
    orderType: '透析',
    content: `【依頼種別】一時的導入（急性期）
【緊急度】至急
【透析種別】血液透析（HD） 4時間
【導入理由】急性腎障害（AKI）、心不全合併
【アクセス】透析用カテーテル（右内頸静脈）2025/10/14留置
【感染症】MRSA保菌（隔離必要）`,
    allergies: [],
    hasAllergies: false,
    hasContraindications: true,
    location: '外来',
    department: '腎臓内科',
    attendingDoctor: '山田 太郎',
    receivedAt: '2025/10/15 08:00',
    acceptedAt: '2025/10/15 08:10',
    acceptedBy: '看護師C',
    implementedAt: '2025/10/15 12:30',
    implementedBy: '看護師C',
    implementationNotes: '透析4時間実施完了。除水2.3L。バイタル安定。',
    statusHistory: [
      {
        status: '指示受済',
        timestamp: '2025/10/15 08:00',
        updatedBy: 'システム'
      },
      {
        status: '実施済',
        timestamp: '2025/10/15 08:10',
        updatedBy: '看護師C'
      }
    ]
  },
  {
    id: 'ORD-030',
    status: '実施済',
    patientId: 'P00012371',
    patientName: '井上 和子',
    patientKana: 'イノウエ カズコ',
    gender: '女',
    birthDate: '1968/12/03',
    age: 56,
    height: 155,
    weight: 54.8,
    orderType: '透析',
    content: `【依頼種別】他院からの継続
【透析種別】血液透析濾過（HDF） 4時間
【導入理由】糖尿病性腎症（透析歴3年）
【アクセス】人工血管（AVG）右上腕 2022/08/15作成
【感染症】なし（隔離不要）`,
    allergies: [],
    hasAllergies: false,
    hasContraindications: true,
    location: '外来',
    department: '腎臓内科',
    attendingDoctor: '田中 美咲',
    receivedAt: '2025/10/15 13:00',
    acceptedAt: '2025/10/15 13:05',
    acceptedBy: '看護師A',
    statusHistory: [
      {
        status: '指示受済',
        timestamp: '2025/10/15 13:00',
        updatedBy: 'システム'
      },
      {
        status: '実施済',
        timestamp: '2025/10/15 13:05',
        updatedBy: '看護師A'
      }
    ]
  }
];

export const contraindications: Contraindication[] = [
  {
    id: 'ci1',
    type: '特記事項',
    title: 'シャント左前腕',
    reason: '左前腕AVF（2023/05/10作成）。シャント肢での血圧測定・採血・点滴禁止。',
    registeredDate: '2023/05/10',
    registeredBy: '透析記録',
    confirmed: false
  },
  {
    id: 'ci2',
    type: '特記事項',
    title: 'ドライウェイト変更',
    reason: '2025/01/10よりドライウェイト62.0kg→61.5kgへ変更。体重増加過多の場合は主治医へ連絡。',
    registeredDate: '2025/01/10',
    registeredBy: '主治医指示',
    confirmed: false
  },
  {
    id: 'ci3',
    type: '特記事項',
    title: '透析中血圧低下傾向',
    reason: '透析中に収縮期血圧90mmHg以下になることあり。除水速度調整と頻回バイタル測定必要。',
    registeredDate: '2024/11/20',
    registeredBy: '透析記録',
    confirmed: false
  },
  {
    id: 'ci4',
    type: '特記事項',
    title: '糖尿病性腎症（合併症）',
    reason: '慢性腎不全の原疾患。HbA1c 7.2%、血糖コントロール継続中。低血糖に注意。',
    registeredDate: '2018/03/20',
    registeredBy: '主治医記録',
    confirmed: false
  },
  {
    id: 'ci5',
    type: '特記事項',
    title: '二次性副甲状腺機能亢進症（合併症）',
    reason: 'iPTH高値（285 pg/mL）。カルシウム・リン管理継続中。骨折リスク注意。',
    registeredDate: '2022/07/15',
    registeredBy: '透析記録',
    confirmed: false
  },
  {
    id: 'ci6',
    type: '特記事項',
    title: '心血管合併症リスク',
    reason: '陳旧性心筋梗塞（2020年）。透析中の胸痛・胸部不快感出現時は直ちに報告。',
    registeredDate: '2020/11/08',
    registeredBy: '循環器科記録',
    confirmed: false
  },
  // 井上和子さんの注意事項・合併症
  {
    id: 'ci7',
    type: '特記事項',
    title: 'シャント右上腕',
    reason: '右上腕AVG（2022/08/15作成）。シャント肢での血圧測定・採血・点滴禁止。',
    registeredDate: '2022/08/15',
    registeredBy: '透析記録',
    confirmed: false
  },
  {
    id: 'ci8',
    type: '特記事項',
    title: 'ドライウェイト設定',
    reason: 'ドライウェイト54.5kg。体重増加率5%以内を目標。',
    registeredDate: '2024/08/01',
    registeredBy: '主治医指示',
    confirmed: false
  },
  {
    id: 'ci9',
    type: '特記事項',
    title: '糖尿病性腎症（合併症）',
    reason: '原疾患は糖尿病性腎症。HbA1c 6.8%、インスリン療法中。透析前後の血糖測定必須。',
    registeredDate: '2019/06/10',
    registeredBy: '主治医記録',
    confirmed: false
  },
  {
    id: 'ci10',
    type: '特記事項',
    title: '糖尿病性網膜症（合併症）',
    reason: '増殖性網膜症あり。視力低下進行中。転倒リスク注意。',
    registeredDate: '2020/03/15',
    registeredBy: '眼科記録',
    confirmed: false
  },
  {
    id: 'ci11',
    type: '特記事項',
    title: '末梢神経障害（合併症）',
    reason: '糖尿病性神経障害による下肢しびれあり。足病変予防のため足観察必須。',
    registeredDate: '2021/11/05',
    registeredBy: '主治医記録',
    confirmed: false
  },
  // 山口健太郎さんの注意事項・合併症
  {
    id: 'ci12',
    type: '特記事項',
    title: '透析用カテーテル',
    reason: '右内頸静脈透析用カテーテル（2025/10/14留置）。カテーテル挿入部の感染予防、固定確認必須。',
    registeredDate: '2025/10/14',
    registeredBy: '透析記録',
    confirmed: false
  },
  {
    id: 'ci13',
    type: '特記事項',
    title: 'MRSA保菌（隔離必要）',
    reason: 'MRSA保菌者。個室隔離透析必須。標準予防策に加え接触予防策実施。',
    registeredDate: '2025/10/12',
    registeredBy: '感染制御室',
    confirmed: false
  },
  {
    id: 'ci14',
    type: '特記事項',
    title: 'ドライウェイト暫定設定',
    reason: '急性期導入のためドライウェイト暫定58.5kg。浮腫・胸水の評価を行い適宜調整。',
    registeredDate: '2025/10/14',
    registeredBy: '主治医指示',
    confirmed: false
  },
  {
    id: 'ci15',
    type: '特記事項',
    title: '心不全合併（合併症）',
    reason: '急性腎障害に心不全合併。NYHA III度。呼吸状態・浮腫の観察強化。',
    registeredDate: '2025/10/10',
    registeredBy: '循環器科記録',
    confirmed: false
  },
  {
    id: 'ci16',
    type: '特記事項',
    title: '電解質異常（合併症）',
    reason: '高カリウム血症（K 6.2mEq/L）あり。不整脈出現時は直ちに報告。心電図モニタリング推奨。',
    registeredDate: '2025/10/14',
    registeredBy: '主治医記録',
    confirmed: false
  },
  {
    id: 'ci17',
    type: '特記事項',
    title: '貧血（合併症）',
    reason: '腎性貧血（Hb 8.2 g/dL）。ESA製剤投与中。ふらつき・転倒リスク注意。',
    registeredDate: '2025/10/11',
    registeredBy: '主治医記録',
    confirmed: false
  }
];

// 旧データ（アレルギーダイアログで使用）
export const oldContraindications = [
  {
    id: 'c1',
    medication: 'ペニシリン系抗生物質',
    allergen: 'ペニシリン系抗生物質',
    severity: '禁忌',
    match: true
  },
  {
    id: 'c2',
    medication: '造影剤使用検査',
    allergen: '造影剤',
    severity: '要注意',
    match: false
  }
];

export const medicalHistory = [
  {
    id: 'h1',
    condition: '高血圧症',
    diagnosedDate: '2020/04/01',
    status: '治療継続中'
  },
  {
    id: 'h2',
    condition: '糖尿病（2型）',
    diagnosedDate: '2018/09/15',
    status: '治療継続中'
  }
];