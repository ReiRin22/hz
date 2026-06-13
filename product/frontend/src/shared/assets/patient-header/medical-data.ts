import type { 
  Patient, 
  MedicalAlert, 
  ProgressRecord, 
  HandoverItem, 
  MedicationRecord, 
  MedicalRecord, 
  ExternalMedicalRecord, 
  HealthCheckupRecord,
  TestResult,
  CurrentUser,
  UserAlert
} from "@/shared/types/patient-types";

// 患者データベース
export const patientDatabase: Record<string, Patient> = {
  "P123456789": {
    name: "山田 太郎",
    kana: "ヤマダ タロウ",
    patientId: "P123456789",
    birthDate: "1985(昭60)年5月15日",
    gender: "男性",
    age: 39,
    department: "循環器内科",
    ward: "内科病棟",
    room: "301A",
    doctor: "田中 医師",
    allergies: ["ペニシリン", "造影剤"],
    infections: ["結核", "MRSA"],
    consultationStatus: "in-progress",
    prescriptionStatus: "electronic",
    admissionType: "inpatient",
    radiationExposure: {
      dose: 15.2,
      unit: "mSv",
      level: "moderate"
    },
    lastExamination: {
      date: "2024/12/03 14:30",
      type: "胸部CT"
    },
    medicalInfoSharing: {
      status: "full-consent",
      consentDate: "2024年9月15日",
      expiryDate: "2026年9月14日",
      lastUpdated: "2024年9月15日",
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: true,
        labResults: true,
        referralLetters: true
      }
    },
    insurance: {
      type: "社保",
      number: "06123456",
      burden: "3割",
    },
  },
  "P987654321": {
    name: "佐藤 花子",
    kana: "サトウ ハナコ",
    patientId: "P987654321",
    birthDate: "1992(平4)年8月22日",
    gender: "女性",
    age: 32,
    department: "内分泌内科",
    ward: "内科病棟",
    room: "205B",
    doctor: "鈴木 医師",
    allergies: ["造影剤"],
    infections: [],
    consultationStatus: "completed",
    prescriptionStatus: "paper",
    medicalInfoSharing: {
      status: "partial-consent",
      consentDate: "2024年8月10日",
      expiryDate: "2026年8月9日",
      lastUpdated: "2024年10月1日",
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: false,
        labResults: true,
        referralLetters: false
      }
    },
    insurance: {
      type: "国保",
      number: "12345678",
      burden: "3割",
    },
  },
  "P456789123": {
    name: "田中 健一",
    kana: "タナカ ケンイチ",
    patientId: "P456789123",
    birthDate: "1978(昭53)年12月10日",
    gender: "男性",
    age: 45,
    department: "整形外科",
    ward: "外科病棟",
    room: "402A",
    doctor: "山田 医師",
    allergies: [],
    infections: [],
    consultationStatus: "waiting",
    prescriptionStatus: "disconnected",
    medicalInfoSharing: {
      status: "no-consent",
      consentDate: undefined,
      expiryDate: undefined,
      lastUpdated: "2024年7月20日"
    },
    insurance: {
      type: "社保",
      number: "98765432",
      burden: "3割",
    },
  },
  "P789123456": {
    name: "鈴木 美香",
    kana: "スズキ ミカ",
    patientId: "P789123456",
    birthDate: "1965(昭40)年3月5日",
    gender: "女性",
    age: 59,
    department: "消化器内科",
    ward: "内科病棟",
    room: "303C",
    doctor: "高橋 医師",
    allergies: ["ペニシリン", "セファロスポリン"],
    infections: ["C型肝炎"],
    consultationStatus: "postponed",
    prescriptionStatus: "paper",
    medicalInfoSharing: {
      status: "partial-consent",
      consentDate: "2024年6月5日",
      expiryDate: "2026年6月4日",
      lastUpdated: "2024年8月15日",
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: false,
        diagnosticImages: true,
        labResults: false,
        referralLetters: true
      }
    },
    insurance: {
      type: "国保",
      number: "56789012",
      burden: "1割",
    },
  },
  // 新患用患者データ
  "P001234567": {
    name: "山田 太郎",
    kana: "ヤマダ タロウ",
    patientId: "P001234567",
    birthDate: "1990(平2)年7月28日",
    gender: "男性",
    age: 34,
    department: "内科",
    ward: "外来",
    room: "診察室1",
    doctor: "田中 医師",
    allergies: [],
    infections: [],
    consultationStatus: "in-progress",
    prescriptionStatus: "electronic",
    medicalInfoSharing: {
      status: "full-consent",
      consentDate: "2024年10月7日",
      expiryDate: "2026年10月6日",
      lastUpdated: "2024年10月7日",
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: true,
        labResults: true,
        referralLetters: true
      }
    },
    insurance: {
      type: "社保",
      number: "11223456",
      burden: "3割",
    },
  },
  "P002345678": {
    name: "初診 花子",
    kana: "ショシン ハナコ",
    patientId: "P002345678",
    birthDate: "1995(平7)年3月12日",
    gender: "女性",
    age: 29,
    department: "内科",
    ward: "外来",
    room: "診察室2",
    doctor: "鈴木 医師",
    allergies: [],
    infections: [],
    consultationStatus: "waiting",
    prescriptionStatus: "electronic",
    medicalInfoSharing: { status: "no-consent" },
    insurance: {
      type: "国保",
      number: "22334455",
      burden: "3割",
    },
  },
  // 外来患者データ
  "P555111222": {
    name: "高橋 一郎",
    kana: "タカハシ イチロウ",
    patientId: "P555111222",
    birthDate: "1975(昭50)年3月22日",
    gender: "男性",
    age: 49,
    department: "内科",
    ward: "外来",
    room: "診察室3",
    doctor: "田中 医師",
    allergies: ["造影剤"],
    infections: [],
    consultationStatus: "in-progress",
    prescriptionStatus: "electronic",
    admissionType: "outpatient",
    medicalInfoSharing: {
      status: "full-consent",
      consentDate: "2024年9月15日",
      expiryDate: "2026年9月14日",
      lastUpdated: "2024年9月15日",
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: true,
        labResults: true,
        referralLetters: true
      }
    },
    insurance: {
      type: "社保",
      number: "77889900",
      burden: "3割",
    },
  },
  // 自費患者データ
  "P666222333": {
    name: "鈴木 次郎",
    kana: "スズキ ジロウ",
    patientId: "P666222333",
    birthDate: "1988(昭63)年7月18日",
    gender: "男性",
    age: 36,
    department: "整形外科",
    ward: "外来",
    room: "診察室2",
    doctor: "山田 医師",
    allergies: [],
    infections: [],
    consultationStatus: "waiting",
    prescriptionStatus: "paper",
    admissionType: "outpatient",
    medicalInfoSharing: {
      status: "no-consent",
      consentDate: "",
      expiryDate: "",
      lastUpdated: "",
      details: {
        emergencyMedicalInfo: false,
        prescriptionHistory: false,
        diagnosticImages: false,
        labResults: false,
        referralLetters: false
      }
    },
    insurance: {
      type: "自費",
      number: "N/A",
      burden: "10割",
    },
  },
};

// デフォルト患者（再診患者）
export const defaultPatient = patientDatabase["P123456789"];

// ログインユーザーのサンプルデータ
export const currentUser: CurrentUser = {
  name: "田中 一郎",
  role: "医師",
  department: "循環器内科",
  id: "D001234",
  loginTime: "09:30"
};

// 既存患者用アラートデータ
export const existingPatientAlerts: MedicalAlert[] = [
  {
    id: "1",
    type: "critical",
    category: "allergy",
    title: "アレルギー警告",
    message: "患者はペニシリンアレルギーがあります。処方薬を確認してください。",
    timestamp: "14:30",
  },
  {
    id: "2",
    type: "warning",
    category: "interaction",
    title: "薬剤相互作用",
    message: "ワルファリンとアスピリンの併用に注意が必要です。",
    timestamp: "13:45",
  },
  {
    id: "3",
    type: "info",
    category: "vital",
    title: "血圧上昇",
    message: "最新の血圧値が正常範囲を上回っています（150/95）。",
    timestamp: "12:15",
  },
];

// 新患用アラートデータ（初診時に必要な基本的なアラート）
export const newPatientAlerts: MedicalAlert[] = [
  {
    id: "new1",
    type: "info",
    category: "system",
    title: "初診患者確認",
    message: "初診患者です。アレルギー・感染症歴の詳細な聴取を行ってください。",
    timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: "new2",
    type: "warning",
    category: "documentation",
    title: "必要書類確認",
    message: "保険証・身分証明書の確認、同意書の記入をお忘れなく。",
    timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: "new3",
    type: "info",
    category: "workflow",
    title: "初診記録作成",
    message: "詳細な病歴聴取と全身状態の記録が必要です。SOAP形式で記録してください。",
    timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  },
];

// 経過記録のサンプルデータ（既存患者用）
export const sampleProgressRecords: ProgressRecord[] = [
  {
    id: "prog1",
    date: "2024/12/27",
    time: "14:30",
    type: "progress",
    title: "胸痛症状の改善",
    content: "患者の胸痛症状は朝から軽減しており、労作時の不快感も減少している。ニトロール舌下錠の効果が見られる。血圧も安定している。",
    author: "田中 医師",
    department: "循環器内科",
    isImportant: true,
  },
  {
    id: "prog2",
    date: "2024/12/27",
    time: "12:15",
    type: "vital",
    title: "血圧値の変動",
    content: "午前中の血圧測定では150/95から140/88に低下。降圧薬の効果が現れている。引き続き経過観察が必要。",
    author: "佐藤 看護師",
    department: "循環器内科",
    isImportant: false,
  },
  {
    id: "prog3",
    date: "2024/12/26",
    time: "18:45",
    type: "observation",
    title: "夜間の睡眠状況",
    content: "患者は夜間よく眠れており、胸痛による覚醒はなし。SpO2も98%で安定している。",
    author: "鈴木 看護師",
    department: "循環器内科",
    isImportant: false,
  },
  {
    id: "prog4",
    date: "2024/12/26",
    time: "15:20",
    type: "treatment",
    title: "心電図検査実施",
    content: "12誘導心電図を実施。軽度のST低下は持続しているが、昨日より改善傾向。循環器科と相談し、追加検査を検討中。",
    author: "田中 医師",
    department: "循環器内科",
    isImportant: true,
  },
];

// 申し送りのサンプルデータ（既存患者用）
export const sampleHandoverItems: HandoverItem[] = [
  {
    id: "hand1",
    date: "2024/12/27",
    time: "16:00",
    shift: "evening",
    fromUser: "田中 医師",
    toUser: "山田 医師",
    priority: "high",
    category: "patient-condition",
    title: "血圧変動の注意深い観察",
    content: "患者の血圧が不安定なため、準夜勤務中は2時間毎の測定をお願いします。150/90を超える場合は連絡してください。",
    isRead: false,
    isResolved: false,
  },
  {
    id: "hand2",
    date: "2024/12/27",
    time: "15:30",
    shift: "evening",
    fromUser: "佐藤 看護師",
    toUser: "林 看護師",
    priority: "medium",
    category: "medication",
    title: "夕食後の服薬確認",
    content: "患者が新しい降圧薬（アムロジピン5mg）を開始しました。夕食後の服薬状況と副作用の有無を確認してください。",
    isRead: true,
    isResolved: false,
  },
  {
    id: "hand3",
    date: "2024/12/27",
    time: "14:00",
    shift: "day",
    fromUser: "鈴木 看護師",
    toUser: "佐藤 看護師",
    priority: "high",
    category: "family",
    title: "家族への病状説明予定",
    content: "明日10時に患者の奥様が面会予定です。田中医師から病状説明を行う予定ですので、事前に連絡をお願いします。",
    isRead: true,
    isResolved: true,
  },
  {
    id: "hand4",
    date: "2024/12/26",
    time: "22:00",
    shift: "night",
    fromUser: "高橋 看護師",
    toUser: "鈴木 看護師",
    priority: "low",
    category: "other",
    title: "検査予約の調整",
    content: "心エコー検査の予約が来週月曜日に変更になりました。患者には伝達済みです。",
    isRead: true,
    isResolved: true,
  },
];

// 患者別の画像データベース（画像件数管理）
export const imageDatabase: Record<string, number> = {
  "P123456789": 3, // 既存患者は画像あり
  "P987654321": 2,
  "P456789123": 1,
  "P789123456": 4,
  "P001234567": 0, // 新患は画像なし
  "P002345678": 0, // 新患は画像なし
  "P555111222": 2, // 外来患者は画像あり
};


// 患者別のテスト結果データベース（検査結果件数管理）
export const testResultsDatabase: Record<string, TestResult[]> = {
  "P123456789": [
    { name: "血糖", value: "145", unit: "mg/dl", normalRange: "70-109", isAbnormal: true },
    { name: "HbA1c", value: "7.2", unit: "%", normalRange: "4.6-6.2", isAbnormal: true },
    { name: "総コレステロール", value: "220", unit: "mg/dl", normalRange: "<220", isAbnormal: false },
    { name: "HDL-C", value: "45", unit: "mg/dl", normalRange: ">40", isAbnormal: false },
    { name: "LDL-C", value: "140", unit: "mg/dl", normalRange: "<120", isAbnormal: true },
    { name: "中性脂肪", value: "180", unit: "mg/dl", normalRange: "<150", isAbnormal: true },
    { name: "尿酸", value: "6.8", unit: "mg/dl", normalRange: "2.1-7.0", isAbnormal: false },
    { name: "クレアチニン", value: "1.1", unit: "mg/dl", normalRange: "0.6-1.2", isAbnormal: false },
  ],
  "P987654321": [
    { name: "HbA1c", value: "6.8", unit: "%", normalRange: "4.6-6.2", isAbnormal: true },
    { name: "血糖", value: "130", unit: "mg/dl", normalRange: "70-109", isAbnormal: true },
    { name: "総コレステロール", value: "195", unit: "mg/dl", normalRange: "<220", isAbnormal: false },
  ],
  "P456789123": [
    { name: "CRP", value: "2.1", unit: "mg/dl", normalRange: "<0.3", isAbnormal: true },
    { name: "白血球数", value: "8900", unit: "/μl", normalRange: "3500-9700", isAbnormal: false },
  ],
  "P789123456": [
    { name: "AST", value: "35", unit: "U/l", normalRange: "10-40", isAbnormal: false },
    { name: "ALT", value: "42", unit: "U/l", normalRange: "5-45", isAbnormal: false },
    { name: "γ-GTP", value: "28", unit: "U/l", normalRange: "10-75", isAbnormal: false },
    { name: "総ビリルビン", value: "1.2", unit: "mg/dl", normalRange: "0.2-1.2", isAbnormal: false },
  ],
  "P001234567": [],
  "P002345678": [],
  "P555111222": [
    { name: "血糖", value: "98", unit: "mg/dl", normalRange: "70-109", isAbnormal: false },
    { name: "HbA1c", value: "5.6", unit: "%", normalRange: "4.6-6.2", isAbnormal: false },
    { name: "総コレステロール", value: "215", unit: "mg/dl", normalRange: "<220", isAbnormal: false },
    { name: "HDL-C", value: "55", unit: "mg/dl", normalRange: ">40", isAbnormal: false },
    { name: "LDL-C", value: "135", unit: "mg/dl", normalRange: "<120", isAbnormal: true },
    { name: "中性脂肪", value: "125", unit: "mg/dl", normalRange: "<150", isAbnormal: false },
    { name: "AST", value: "28", unit: "U/l", normalRange: "10-40", isAbnormal: false },
    { name: "ALT", value: "32", unit: "U/l", normalRange: "5-45", isAbnormal: false },
  ],
}; /*
    { name: "血糖", value: \"98\", unit: \"mg/dl\", normalRange: \"70-109\", isAbnormal: false },
    { name: \"HbA1c\", value: \"5.6\", unit: \"%\", normalRange: \"4.6-6.2\", isAbnormal: false },
    { name: \"総コレステロール\", value: \"215\", unit: \"mg/dl\", normalRange: \"<220\", isAbnormal: false },
    { name: \"HDL-C\", value: \"55\", unit: \"mg/dl\", normalRange: \">40\", isAbnormal: false },
    { name: \"LDL-C\", value: \"135\", unit: \"mg/dl\", normalRange: \"<120\", isAbnormal: true },
    { name: \"中性脂肪\", value: \"125\", unit: \"mg/dl\", normalRange: \"<150\", isAbnormal: false },
    { name: \"AST\", value: \"28\", unit: \"U/l\", normalRange: \"10-40\", isAbnormal: false },
    { name: \"ALT\", value: \"32\", unit: \"U/l\", normalRange: \"5-45\", isAbnormal: false },
  ],
};
*/

// 患者別の診療記録データベース
export const recordsDatabase: Record<string, MedicalRecord[]> = {
  "P123456789": [
    // 最新の記録（2024/12/30）
    {
      id: "rec_p123_5",
      date: "2024/12/30",
      time: "14:15",
      type: "progress",
      title: "定期診察・症状フォローアップ",
      content: "胸痛症状は著明に改善。運動負荷時の症状もほぼ消失。血圧コントロール良好。",
      author: "田中 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
胸痛症状は前回より著明に改善し、階段昇降時も症状なし。
ニトロール舌下錠は2日前を最後に使用していない。
夜間の睡眠も良好で、日常生活に支障なし。

O (Objective - 客観的情報):
バイタルサイン：BP 138/85mmHg, HR 76bpm, BT 36.7℃, SpO2 98%
心音：I音II音整、心雑音軽減傾向
肺音：清、ラ音なし
腹部：平坦・軟、圧痛なし
下肢：浮腫なし

A (Assessment - 評価・診断):
労作性狭心症　症状改善中
高血圧症　コントロール良好

P (Plan - 計画・治療方針):
現在の薬物療法継続
運動療法段階的増加
次回診察：2週間後
緊急時はニトロール舌下錠使用指示`,
      vitalSigns: {
        bloodPressure: "138/85",
        pulse: "76",
        temperature: "36.7",
        respiratoryRate: "18",
        oxygenSaturation: "98",
      },
    },
    // 2024/12/29の記録
    {
      id: "rec_p123_4",
      date: "2024/12/29",
      time: "10:45",
      type: "test",
      title: "心エコー検査結果",
      content: "心エコー検査実施。左室壁運動に軽度異常所見あり。EF55%で軽度低下。",
      author: "山田 検査技師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
心エコー検査所見：
・左室壁厚：正常範囲
・左室内径：正常範囲
・駆出率（EF）：55%（軽度低下）
・壁運動：前壁下部に軽度低運動
・弁膜症：軽度僧帽弁逆流
・心嚢液：なし

A (Assessment - 評価・診断):
軽度左室収縮能低下
軽度僧帽弁逆流

P (Plan - 計画・治療方針):
主治医へ報告済み
薬物療法の調整検討
定期的心エコーフォロー要`,
      vitalSigns: {
        bloodPressure: "142/88",
        pulse: "82",
        temperature: "36.8",
        respiratoryRate: "19",
        oxygenSaturation: "97",
      },
    },
    // 2024/12/28の記録
    {
      id: "rec_p123_3",
      date: "2024/12/28",
      time: "16:20",
      type: "nursing",
      title: "服薬指導・生活指導",
      content: "薬剤師による服薬指導実施。生活指導も併せて行った。",
      author: "佐藤 薬剤師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
薬の飲み忘れが時々ある（週1-2回程度）
朝の血圧薬を忘れることが多い
食事は減塩を心がけているが外食時は難しい

O (Objective - 客観的情報):
持参薬確認：アムロジピン5mg、ニトロール5mg
服薬コンプライアンス：約85%
血圧手帳記載：概ね良好

A (Assessment - 評価・診断):
服薬コンプライアンス改善の余地あり
生活習慣の見直し必要

P (Plan - 計画・治療方針):
お薬カレンダーの使用提案
血圧測定の継続指導
減塩食品の紹介
次回薬剤師面談：1週間後`,
      vitalSigns: {
        bloodPressure: "140/90",
        pulse: "78",
        temperature: "36.6",
        respiratoryRate: "18",
        oxygenSaturation: "98",
      },
    },
    // 2024/12/27の記録
    {
      id: "rec_p123_2",
      date: "2024/12/27",
      time: "14:30",
      type: "progress",
      title: "胸痛症状の改善確認",
      content: "前���からの胸痛症状軽減を確認。血圧も安定してきている。",
      author: "田中 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
昨日からの胸痛症状は軽減している
労作時の不快感も減少
ニトロール舌下錠は昨日1回使用

O (Objective - 客観的情報):
バイタルサイン：BP 145/92mmHg, HR 88bpm, BT 36.9℃
心音：整、III/VI収縮期雑音聴取
肺音：清
腹部：平坦・軟
下肢：浮腫なし

A (Assessment - 評価・診断):
労作性胸痛　改善傾向
心疾患疑い（虚血性心疾患の可能性）

P (Plan - 計画・治療方針):
現在の治療継続
心エコー検査明日予定
血圧モニタリング継続`,
      vitalSigns: {
        bloodPressure: "145/92",
        pulse: "88",
        temperature: "36.9",
        respiratoryRate: "20",
        oxygenSaturation: "97",
      },
    },
    // 2024/12/26の記録
    {
      id: "rec_p123_1",
      date: "2024/12/26",
      time: "09:30",
      type: "progress",
      title: "初診・胸痛の精査",
      content: "胸痛を主訴に来院。心電図、血液検査を実施。",
      author: "田中 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
3日前より胸部不快感を自覚
労作時に増強する傾向あり
安静時は症状軽度
既往歴：高血圧症

O (Objective - 客観的情報):
バイタルサイン：BP 150/95mmHg, HR 92bpm, BT 36.8℃
心音：整、III/VI収縮期雑音聴取
肺音：清
腹部：平坦・軟
下肢：浮腫なし
心電図：軽度ST低下（V4-V6）

A (Assessment - 評価・診断):
労作性胸痛
虚血性心疾患疑い
高血圧症

P (Plan - 計画・治療方針):
心電図検査実施済み
心エコー検査予定
血液検査（心筋マーカー含む）
ニトロール舌下錠処方
アムロジピン5mg開始`,
      vitalSigns: {
        bloodPressure: "150/95",
        pulse: "92",
        temperature: "36.8",
        respiratoryRate: "22",
        oxygenSaturation: "96",
      },
    },
    // 2025年7月-8月の記録
    {
      id: "rec_p123_6",
      date: "2025/08/15",
      time: "11:20",
      type: "progress",
      title: "定期診察・夏季血圧管理",
      content: "夏季の血圧変動を確認。暑さによる脱水予防と血圧管理について指導。",
      author: "田中 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
夏になってから血圧が下がり気味
朝の血圧測定で120/75mmHg程度
めまいやふらつきは軽度
水分摂取は意識して増やしている

O (Objective - 客観的情報):
バイタルサイン：BP 125/78mmHg, HR 68bpm, BT 36.5℃
体重：72kg（2kg減少）
心音：整、雑音なし
肺音：清
皮膚：乾燥なし、弾性良好

A (Assessment - 評価・診断):
夏季血圧低下傾向
脱水なし、コントロール良好

P (Plan - 計画・治療方針):
降圧薬用量調整検討
水分・塩分摂取指導
熱中症予防指導
次回診察：1ヶ月後`,
      vitalSigns: {
        bloodPressure: "125/78",
        pulse: "68",
        temperature: "36.5",
        respiratoryRate: "16",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p123_7",
      date: "2025/07/22",
      time: "14:45",
      type: "test",
      title: "心電図・心エコー定期検査",
      content: "半年毎の定期検査実施。心機能安定、治療効果良好。",
      author: "山田 検査技師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
心電図所見：
・洞調律、HR 72bpm
・ST変化なし（前回から改善）
・期外収縮なし

心エコー所見：
・左室駆出率（EF）：58%（改善）
・壁運動：正常範囲内
・弁膜症：軽度僧帽弁逆流（変化なし）
・心嚢液：なし

A (Assessment - 評価・診断):
心機能改善継続
虚血性変化なし

P (Plan - 計画・治療方針):
主治医へ良好な結果報告
現在の治療継続
次回定期検査：6ヶ月後`,
      vitalSigns: {
        bloodPressure: "130/82",
        pulse: "72",
        temperature: "36.6",
        respiratoryRate: "17",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p123_8",
      date: "2025/07/08",
      time: "10:15",
      type: "progress",
      title: "運動負荷試験結果説明",
      content: "運動負荷試験実施。運動耐容能改善を確認。段階的運動療法継続指示。",
      author: "田中 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
運動負荷試験中、胸痛なし
息切れも軽度のみ
日常生活での運動は問題なし
階段昇降も楽になった

O (Objective - 客観的情報):
運動負荷試験結果：
・最大心拍数：158bpm（目標心拍数の95%）
・運動時間：12分（前回8分から改善）
・血圧応答：正常
・ST変化：なし
・症状：なし

A (Assessment - 評価・診断):
運動耐容能改善
虚血性心疾患コントロール良好

P (Plan - 計画・治療方針):
運動療法段階的増強
週3回、30分の有酸素運動
心拍数120bpm程度で実施
次回診察：1ヶ月後`,
      vitalSigns: {
        bloodPressure: "135/85",
        pulse: "78",
        temperature: "36.7",
        respiratoryRate: "18",
        oxygenSaturation: "98",
      },
    },
  ],
  "P987654321": [
    // 佐藤花子（内分泌内科）の記録
    {
      id: "rec_p987_4",
      date: "2024/12/30",
      time: "11:30",
      type: "progress",
      title: "糖尿病定期診察",
      content: "HbA1cは目標値に近づいている。血糖コントロール良好。合併症スクリーニング実施。",
      author: "鈴木 医師",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
血糖測定を朝夕実施、概ね120-140mg/dl
低血糖症状なし
食事療法は継続中、運動は週3回散歩
体重は1kg減少

O (Objective - 客観的情報):
体重：58kg（前回59kg）
BP：125/78mmHg, HR 72bpm
HbA1c：6.5%（前回6.8%）
空腹時血糖：118mg/dl
眼底検査：糖尿病性変化なし
足部チェック：問題なし

A (Assessment - 評価・診断):
2型糖尿病　血糖コントロール改善中
高血圧症　コントロール良好

P (Plan - 計画・治療方針):
現在の治療継続
HbA1c目標6.5%未満達成
次回診察：1ヶ月後
年1回の合併症スクリーニング継続`,
      vitalSigns: {
        bloodPressure: "125/78",
        pulse: "72",
        temperature: "36.5",
        respiratoryRate: "16",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p987_3",
      date: "2024/12/28",
      time: "15:45",
      type: "test",
      title: "血液検査・眼底検査",
      content: "定期血液検査とHbA1c測定、眼底検査実施。",
      author: "高橋 検査技師",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
血液検査結果：
・HbA1c：6.5%（改善）
・空腹時血糖：118mg/dl
・総コレステロール：190mg/dl
・HDL-C：52mg/dl
・LDL-C：115mg/dl
・中性脂肪：135mg/dl
・尿酸：4.8mg/dl
・クレアチニン：0.8mg/dl

眼底検査：
・糖尿病性網膜症：なし
・出血、滲出物：なし
・視神経乳頭：正常

A (Assessment - 評価・診断):
血糖コントロール改善
糖尿病合併症なし

P (Plan - 計画・治療方針):
主治医へ結果報告
現在の治療継続`,
      vitalSigns: {
        bloodPressure: "128/80",
        pulse: "74",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p987_2",
      date: "2024/12/27",
      time: "13:20",
      type: "nursing",
      title: "栄養指導・生活指導",
      content: "管理栄養士による栄養指導。血糖自己測定の確認。",
      author: "田中 管理栄養士",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
食事は1600kcal/日で管理
間食は控えている
運動は週3回、各30分の散歩
血糖測定は朝夕実施

O (Objective - 客観的情報):
血糖測定記録確認：朝食前110-130mg/dl
体重：59kg（目標58kg）
食事記録：概ね良好
運動記録：週3回実施

A (Assessment - 評価・診断):
食事療法・運動療法継続中
血糖自己管理良好

P (Plan - 計画・治療方針):
現在の食事療法継続
運動強度を段階的に上げる
血糖測定継続
次回栄養指導：1ヶ月後`,
      vitalSigns: {
        bloodPressure: "132/82",
        pulse: "76",
        temperature: "36.6",
        respiratoryRate: "17",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p987_1",
      date: "2024/12/26",
      time: "10:15",
      type: "progress",
      title: "糖尿病外来フォローアップ",
      content: "血糖コントロール状況確認。薬物療法の調整検討。",
      author: "鈴木 医師",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
血糖測定値は朝120-140mg/dl
夕方は100-120mg/dl程度
低血糖症状なし
食事・運動療法は継続中

O (Objective - 客観的情報):
体重：59kg
BP：130/82mmHg, HR 75bpm
前回HbA1c：6.8%
血糖測定器データ確認：概ね良好
足部：潰瘍、感染なし

A (Assessment - 評価・診断):
2型糖尿病　コントロール改善傾向
目標HbA1c 6.5%未満に向けて調整中

P (Plan - 計画・治療方針):
メトホルミン500mg×2継続
明日血液検査予定
栄養指導明日実施
次回診察：1週間後`,
      vitalSigns: {
        bloodPressure: "130/82",
        pulse: "75",
        temperature: "36.5",
        respiratoryRate: "17",
        oxygenSaturation: "98",
      },
    },
    // 2025年7月-8月の記録
    {
      id: "rec_p987_5",
      date: "2025/08/20",
      time: "09:30",
      type: "progress",
      title: "糖尿病定期診察・夏季管理",
      content: "夏季の血糖管理状況確認。HbA1c目標値維持中。熱中症予防指導実施。",
      author: "鈴木 医師",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
夏場の血糖コントロール良好
朝食前血糖110-120mg/dl
食後血糖も140mg/dl以下維持
水分摂取を意識的に増加

O (Objective - 客観的情報):
体重：57kg（維持）
BP：122/76mmHg
HbA1c：6.4%（目標達成）
随時血糖：125mg/dl
尿検査：糖(-), 蛋白(-)
足部：問題なし

A (Assessment - 評価・診断):
2型糖尿病　良好なコントロール維持
夏季合併症予防必要

P (Plan - 計画・治療方針):
現在の治療継続
熱中症・脱水予防指導
血糖測定頻度夏季増加
次回診察：1ヶ月後`,
      vitalSigns: {
        bloodPressure: "122/76",
        pulse: "70",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p987_6",
      date: "2025/07/30",
      time: "15:20",
      type: "nursing",
      title: "夏季栄養指導・水分管理",
      content: "管理栄養士による夏季の食事・水分管理指導。血糖測定記録確認。",
      author: "田中 管理栄養士",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
夏場の食欲は良好
アイスクリームなど冷たい物の摂取増加
水分は1日1.5L以上摂取
運動は朝夕の涼しい時間に実施

O (Objective - 客観的情報):
血糖測定記録：朝食前105-125mg/dl
体重：57kg（変化なし）
食事記録：糖質管理良好
水分摂取記録：適切

A (Assessment - 評価・診断):
夏季栄養管理良好
水分・電解質バランス良好

P (Plan - 計画・治療方針):
冷たい物の糖質に注意
経口補水液の活用指導
運動時間の調整継続
次回栄養指導：1ヶ月後`,
      vitalSigns: {
        bloodPressure: "126/78",
        pulse: "74",
        temperature: "36.5",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p987_7",
      date: "2025/07/15",
      time: "11:45",
      type: "test",
      title: "糖尿病合併症スクリーニング",
      content: "年1回の合併症スクリーニング検査実施。網膜症、腎症、神経障害の評価。",
      author: "高橋 検査技師",
      insurance: { type: "国保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
眼底検査：
・糖尿病性網膜症：なし
・出血、硬性白斑：なし
・視力：右1.0 左1.0

腎機能検査：
・尿蛋白：(-)
・尿中アルブミン：8.5mg/g・Cr（正常）
・血清クレアチニン：0.8mg/dl
・eGFR：>60ml/min/1.73㎡

神経学的検査：
・振動覚：正常
・足底感覚：正常
・アキレス腱反射：正常

A (Assessment - 評価・診断):
糖尿病合併症：なし
良好なコントロール状態

P (Plan - 計画・治療方針):
合併症スクリーニング：異常なし
現在の治療継続
次回スクリーニング：1年後`,
      vitalSigns: {
        bloodPressure: "124/80",
        pulse: "72",
        temperature: "36.3",
        respiratoryRate: "16",
        oxygenSaturation: "99",
      },
    },
  ],
  "P456789123": [
    // 田中健一（整形外科）の記録
    {
      id: "rec_p456_3",
      date: "2024/12/29",
      time: "14:00",
      type: "progress",
      title: "腰痛症フォローアップ",
      content: "腰痛症状は理学療法により改善傾向。MRI検査結果説明。",
      author: "山田 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
腰痛は理学療法開始後軽減
朝の起床時痛は改善
長時間座位での痛みは軽度残存
下肢のしびれはほぼ消失

O (Objective - 客観的情報):
SLRテスト：陰性
腰椎可動域：改善（前屈制限軽度）
下肢筋力：正常
MRI所見：L4/5椎間板軽度突出、神経圧迫軽微

A (Assessment - 評価・診断):
腰椎椎間板症　改善傾向
L4/5椎間板軽度突出

P (Plan - 計画・治療方針):
理学療法継続（週2回）
NSAIDs頓用継続
重労働回避指導
次回診察：2週間後`,
      vitalSigns: {
        bloodPressure: "135/88",
        pulse: "68",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p456_2",
      date: "2024/12/27",
      time: "16:30",
      type: "test",
      title: "MRI検査実施",
      content: "腰椎MRI検査実施。椎間板突出の評価。",
      author: "佐藤 放射線技師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
腰椎MRI所見：
・L4/5椎間板：軽度後方突出
・L5/S1椎間板：変性所見のみ
・脊柱管狭窄：なし
・神経根圧迫：軽微
・椎体変性：年齢相応

A (Assessment - 評価・診断):
L4/5椎間板症
軽度椎間板突出

P (Plan - 計画・治療方針):
主治医へ結果報告
保存的治療継続`,
      vitalSigns: {
        bloodPressure: "138/90",
        pulse: "70",
        temperature: "36.3",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p456_1",
      date: "2024/12/26",
      time: "09:45",
      type: "progress",
      title: "腰痛初診",
      content: "2週間前からの腰痛を主訴に来院。理学所見確認、画像検査予定。",
      author: "山田 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
2週間前より腰痛出現
起床時に強く、日中は軽減
下肢への放散痛時々あり
重い物を持った際に発症

O (Objective - 客観的情報):
腰椎可動域：前屈制限あり
SLRテスト：左45°で陽性
下肢筋力：MMT 4/5（左下肢）
腱反射：正常
知覚障害：L5領域に軽度

A (Assessment - 評価・診断):
腰椎椎間板症疑い
神経根症状あり

P (Plan - 計画・治療方針):
腰椎MRI検査予定
NSAIDs処方（ロキソニン）
理学療法開始
安静指導`,
      vitalSigns: {
        bloodPressure: "140/92",
        pulse: "72",
        temperature: "36.5",
        respiratoryRate: "17",
        oxygenSaturation: "97",
      },
    },
    // 2025年7月-8月の記録
    {
      id: "rec_p456_4",
      date: "2025/08/22",
      time: "16:00",
      type: "progress",
      title: "腰痛症治療終了判定",
      content: "理学療法終了。症状ほぼ消失、日常生活動作に支障なし。治療終了と判定。",
      author: "山田 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
腰痛症状はほぼ消失
長時間座位でも痛みなし
重い物の持ち上げも可能
下肢症状は完全に消失

O (Objective - 客観的情報):
腰椎可動域：制限なし
SLRテスト：陰性
下肢筋力：MMT 5/5
知覚障害：なし
歩行：正常

A (Assessment - 評価・診断):
腰椎椎間板症　寛解
治療目標達成

P (Plan - 計画・治療方針):
理学療法終了
セルフエクササイズ継続指導
重労働時の注意事項説明
症状再燃時は早期受診指示`,
      vitalSigns: {
        bloodPressure: "132/85",
        pulse: "66",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p456_5",
      date: "2025/08/05",
      time: "13:30",
      type: "nursing",
      title: "理学療法最終評価",
      content: "理学療法士による最終評価。筋力、可動域ともに目標値達成。",
      author: "佐藤 理学療法士",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
腰痛VAS：1/10（初回時8/10）
日常生活動作：すべて自立
仕事復帰も問題なし
運動時の痛みなし

O (Objective - 客観的情報):
腰椎屈曲角度：60°（正常）
腰椎伸展角度：20°（正常）
体幹筋力：MMT 5/5
下肢筋力：MMT 5/5
バランステスト：正常

A (Assessment - 評価・診断):
理学療法目標達成
機能的改善良好

P (Plan - 計画・治療方針):
理学療法終了予定
ホームエクササイズ指導
職場復帰支援完了
セルフケア指導`,
      vitalSigns: {
        bloodPressure: "134/88",
        pulse: "68",
        temperature: "36.3",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p456_6",
      date: "2025/07/18",
      time: "10:40",
      type: "progress",
      title: "腰痛症経過良好",
      content: "理学療法効果により症状著明改善。職場復帰に向けた最終調整。",
      author: "山田 医師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `S (Subjective - 主観的情報):
腰痛はほとんど気にならない
長時間のデスクワークも可能
階段昇降時の痛みなし
夜間痛は完全に消失

O (Objective - 客観的情報):
腰椎可動域：ほぼ正常
SLRテスト：陰性
筋緊張：軽度
圧痛：なし
歩行：正常パターン

A (Assessment - 評価・診断):
腰椎椎間板症　著明改善
職場復帰可能レベル

P (Plan - 計画・治療方針):
理学療法継続（あと2週間）
職場復帰許可
重量物取扱い注意
定期フォロー継続`,
      vitalSigns: {
        bloodPressure: "136/90",
        pulse: "70",
        temperature: "36.5",
        respiratoryRate: "17",
        oxygenSaturation: "97",
      },
    },
    {
      id: "rec_p456_7",
      date: "2025/07/03",
      time: "14:20",
      type: "test",
      title: "腰椎MRI フォローアップ",
      content: "治療効果判定のためMRI再検査。椎間板突出の改善を確認。",
      author: "佐藤 放射線技師",
      insurance: { type: "社保", burden: "3割" },
      soapRecord: `O (Objective - 客観的情報):
腰椎MRI比較読影：
・L4/5椎間板：突出軽減
・神経根圧迫：改善
・炎症性変化：消失
・椎間板変性：軽度残存
・脊柱管：狭窄なし

前回（2024/12/27）との比較：
・椎間板突出：明らかな縮小
・神経根周囲浮腫：改善
・全体的な改善傾向

A (Assessment - 評価・診断):
L4/5椎間板症　画像上改善

P (Plan - 計画・治療方針):
主治医へ改善報告
保存的治療継続
理学療法効果確認`,
      vitalSigns: {
        bloodPressure: "138/92",
        pulse: "72",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
  ],
  "P789123456": [
    // 鈴木美香（消化器内科）の記録
    {
      id: "rec_p789_4",
      date: "2024/12/30",
      time: "15:30",
      type: "progress",
      title: "C型肝炎治療効果判定",
      content: "DAA治療終了後のフォローアップ。ウイルス学的著効（SVR）確認。",
      author: "高橋 医師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `S (Subjective - 主観的情報):
全身倦怠感は著明に改善
食欲も回復し体重増加
腹部症状なし
日常生活に支障なし

O (Objective - 客観的情報):
体重：52kg（治療前48kg）
HCV-RNA：検出感度以下
ALT：25U/l（正常化）
AST：28U/l（正常化）
血小板：18万/μl（改善）
腹部エコー：脂肪肝軽度、肝硬変所見なし

A (Assessment - 評価���診断):
C型慢性肝炎　SVR達成
肝機能正常化

P (Plan - 計画・治療方針):
DAA治療完了
定期的フォローアップ継続
肝癌スクリーニング継続（年2回）
次回診察：3ヶ月後`,
      vitalSigns: {
        bloodPressure: "118/72",
        pulse: "65",
        temperature: "36.3",
        respiratoryRate: "15",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p789_3",
      date: "2024/12/28",
      time: "13:45",
      type: "test",
      title: "血液検査・ウイルス量測定",
      content: "DAA治療効果判定のための血液検査実施。",
      author: "田中 検査技師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `O (Objective - 客観的情報):
血液検査結果：
・HCV-RNA：検出感度以下（<10IU/ml）
・ALT：25U/l（正常）
・AST：28U/l（正常）
・γ-GTP：32U/l（改善）
・総ビリルビン：0.9mg/dl
・アルブミン：4.2g/dl
・血小板：18万/μl
・PT：12.5秒（正常）

A (Assessment - 評価・診断):
HCV-RNA陰性化確認
肝機能正常化

P (Plan - 計画・治療方針):
主治医へ結果報告
SVR達成と判断`,
      vitalSigns: {
        bloodPressure: "120/75",
        pulse: "68",
        temperature: "36.4",
        respiratoryRate: "15",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p789_2",
      date: "2024/12/27",
      time: "11:20",
      type: "nursing",
      title: "DAA治療モニタリング",
      content: "DAA治療中の副作用確認と服薬指導。",
      author: "山田 看護師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `S (Subjective - 主観的情報):
DAA治療開始12週目
副作用症状なし
服薬コンプライアンス良好
倦怠感は改善傾向

O (Objective - 客観的情報):
服薬状況：100%コンプライアンス
体重：51kg（前回50kg）
血圧：122/76mmHg
薬剤持参確認：残薬なし

A (Assessment - 評価・診断):
DAA治療継続中
副作用なし、コンプライアンス良好

P (Plan - 計画・治療方針):
治療継続
明日血液検査予定
治療終了は来週予定`,
      vitalSigns: {
        bloodPressure: "122/76",
        pulse: "70",
        temperature: "36.5",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    {
      id: "rec_p789_1",
      date: "2024/12/26",
      time: "14:45",
      type: "progress",
      title: "C型肝炎治療経過観察",
      content: "DAA治療中の定期診察。治療効果と副作用の確認。",
      author: "高橋 医師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `S (Subjective - 主観的情報):
DAA治療開始12週目
全身倦怠感は改善
食欲回復、体重増加傾向
腹部不快感なし

O (Objective - 客観的情報):
体重：50kg（治療前48kg）
前回ALT：45U/l → 30U/l（改善）
前回HCV-RNA：検出感度以下継続
腹部診察：肝腫大なし、圧痛なし
黄疸なし

A (Assessment - 評価・診断):
C型慢性肝炎　DAA治療中
治療効果良好

P (Plan - 計画・治療方針):
DAA治療継続（残り1週間）
来週治療効果判定予定
血液検査継続
肝癌スクリーニング継続`,
      vitalSigns: {
        bloodPressure: "125/78",
        pulse: "72",
        temperature: "36.6",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
    // 2025年7月-8月の記録
    {
      id: "rec_p789_5",
      date: "2025/08/12",
      time: "10:30",
      type: "progress",
      title: "C型肝炎治療後フォローアップ",
      content: "SVR達成後の定期フォロー。肝機能正常、HCV-RNA検出感度以下継続。",
      author: "高橋 医師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `S (Subjective - 主観的情報):
全身状態良好
倦怠感なし
食欲正常、体重安定
腹部症状なし

O (Objective - 客観的情報):
体重：53kg（安定）
HCV-RNA：検出感度以下
ALT：22U/l（正常）
AST：25U/l（正常）
血小板：19万/μl（安定）
腹部エコー：脂肪肝軽度、その他異常なし

A (Assessment - 評価・診断):
C型肝炎　SVR継続中
肝機能正常維持

P (Plan - 計画・治療方針):
定期フォロー継続
肝癌スクリーニング継続
生活指導継続
次回診察：3ヶ月後`,
      vitalSigns: {
        bloodPressure: "115/70",
        pulse: "64",
        temperature: "36.2",
        respiratoryRate: "15",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p789_6",
      date: "2025/07/25",
      time: "15:15",
      type: "test",
      title: "肝癌スクリーニング検査",
      content: "定期肝癌スクリーニング実施。腹部エコー、AFP、PIVKA-II測定。",
      author: "田中 検査技師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `O (Objective - 客観的情報):
腹部エコー所見：
・肝実質：均一、エコーレベル軽度上昇
・肝腫瘍：認めず
・門脈：拡張なし
・脾腫：なし
・腹水：なし

血液検査結果：
・AFP：3.2ng/ml（正常）
・PIVKA-II：15mAU/ml（正常）
・ALT：20U/l
・AST：23U/l
・γ-GTP：28U/l

A (Assessment - 評価・診断):
肝癌スクリーニング：異常なし
慢性肝疾患フォロー中

P (Plan - 計画・治療方針):
肝癌スクリーニング：異常なし
定期フォロー継続
次回スクリーニング：6ヶ月後`,
      vitalSigns: {
        bloodPressure: "118/75",
        pulse: "68",
        temperature: "36.3",
        respiratoryRate: "15",
        oxygenSaturation: "99",
      },
    },
    {
      id: "rec_p789_7",
      date: "2025/07/10",
      time: "13:40",
      type: "nursing",
      title: "生活指導・栄養管理",
      content: "看護師による生活指導。肝臓に優しい食生活と定期検査の重要性について指導。",
      author: "山田 看護師",
      insurance: { type: "国保", burden: "1割" },
      soapRecord: `S (Subjective - 主観的情報):
食事は肝臓に良い物を意識
アルコールは完全禁酒継続
規則正しい生活リズム
定期検査は必ず受診

O (Objective - 客観的情報):
体重：53kg（適正維持）
血圧：120/78mmHg
食事記録：バランス良好
アルコール摂取：なし

A (Assessment - 評価・診断):
生活習慣良好
治療後管理適切

P (Plan - 計画・治療方針):
現在の生活習慣継続
禁酒継続重要性説明
定期検査受診励行
次回看護師面談：3ヶ月後`,
      vitalSigns: {
        bloodPressure: "120/78",
        pulse: "70",
        temperature: "36.4",
        respiratoryRate: "16",
        oxygenSaturation: "98",
      },
    },
  ],
  "P001234567": [],
  "P002345678": [],
};

// 薬歴データベース
export const medicationDatabase: Record<string, MedicationRecord[]> = {
  "P123456789": [
    {
      id: "med1",
      medicationName: "アムロジピン錠",
      genericName: "アムロジピンベシル酸塩",
      dosage: "5mg",
      frequency: "1日1回朝食後",
      route: "経口",
      prescribedDate: "2024-12-25",
      startDate: "2024-12-25",
      duration: 30,
      prescribedBy: "田中 医師",
      department: "循環器内科",
      institution: "自院",
      institutionName: "市立総合病院",
      status: "継続中",
      category: "循環器薬",
      effectiveness: "有効",
      adherence: "良好",
      notes: "血圧コントロール良好。副作用なし。",
    },
    // 他の薬歴...
  ],
  // 他の患者データ...
  "P001234567": [],
  "P002345678": [],
};

// 他院診療情報データベース
export const externalMedicalRecordsDatabase: Record<string, ExternalMedicalRecord[]> = {
  "P123456789": [
    {
      id: "ext1",
      hospitalName: "県立中央病院",
      hospitalType: "総合病院",
      department: "循環器内科",
      date: "2024-11-15",
      type: "診察",
      doctor: "山田 医師",
      title: "狭心症フォローアップ",
      content: "胸痛症状軽減。心電図でST変化改善傾向。冠動脈CT検査により軽度狭窄確認。薬物療法継続で経過観察。",
      diagnosis: "労作性狭心症",
      medications: [
        { name: "ニトロール", dosage: "5mg", frequency: "頓用", duration: 30 },
        { name: "アスピリン", dosage: "100mg", frequency: "1日1回夕食後", duration: 90 }
      ],
      testResults: [
        { name: "CK-MB", value: "15", unit: "U/l", normalRange: "<25", isAbnormal: false },
        { name: "トロポニンI", value: "0.02", unit: "ng/ml", normalRange: "<0.04", isAbnormal: false }
      ],
      isImportant: true,
      referralSource: true
    },
    // 他の記録...
  ],
  // 他の患者データ...
  "P001234567": [],
  "P002345678": [],
};

// 健診情報データベース
export const healthCheckupDatabase: Record<string, HealthCheckupRecord[]> = {
  "P123456789": [
    {
      id: "hc1",
      year: 2024,
      date: "2024-06-15",
      organization: "市立健康センター",
      type: "特定健診",
      results: {
        height: 172,
        weight: 75,
        bmi: 25.3,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 92,
        pulse: 88,
        bodyFat: 22.5,
        waistCircumference: 88,
        visionLeft: 1.0,
        visionRight: 1.0,
        hearing: "正常",
        bloodSugar: 145,
        hba1c: 7.2,
        totalCholesterol: 220,
        hdlCholesterol: 45,
        ldlCholesterol: 140,
        triglycerides: 180,
        uricAcid: 6.8,
        creatinine: 1.1,
        ast: 28,
        alt: 35,
        gammaGtp: 45,
        hemoglobin: 14.2,
        whiteBloodCells: 7200,
        redBloodCells: 450,
        platelets: 280000,
        urineProtein: "陰性",
        urineGlucose: "陽性",
        urineBlood: "陰性",
        chestXray: "正常",
        ecg: "軽度異常",
        upperGi: "要精査"
      },
      abnormalFindings: ["血糖高値", "HbA1c高値", "LDL-C高値", "尿糖陽性", "心電図異常", "上部消化管要精査"],
      recommendations: ["内科受診", "食事療法", "運動療法", "禁煙指導"],
      followUpRequired: true,
      isVisible: true
    },
    // 他の健診記録...
  ],
  // 他の患者データ...
  "P001234567": [],
  "P002345678": [],
};

// 新患の検査結果（基本的な項目のみ）
export const newPatientTestResults: TestResult[] = [
  {
    name: "血圧",
    value: "未測定",
    unit: "mmHg",
    normalRange: "120/80以下",
    isAbnormal: false,
  },
  {
    name: "脈拍",
    value: "未測定",
    unit: "bpm",
    normalRange: "60-100",
    isAbnormal: false,
  },
  {
    name: "体温",
    value: "未測定",
    unit: "°C",
    normalRange: "36.0-37.5",
    isAbnormal: false,
  },
];

// 既存患者の検査結果
export const sampleTestResults: TestResult[] = [
  {
    name: "血糖",
    value: "145",
    unit: "mg/dl",
    normalRange: "70-109",
    isAbnormal: true,
  },
  {
    name: "HbA1c",
    value: "7.2",
    unit: "%",
    normalRange: "4.6-6.2",
    isAbnormal: true,
  },
  {
    name: "総コレステロール",
    value: "220",
    unit: "mg/dl",
    normalRange: "<220",
    isAbnormal: false,
  },
  {
    name: "HDL-C",
    value: "45",
    unit: "mg/dl",
    normalRange: ">40",
    isAbnormal: false,
  },
  {
    name: "LDL-C",
    value: "140",
    unit: "mg/dl",
    normalRange: "<120",
    isAbnormal: true,
  },
  {
    name: "中性脂肪",
    value: "180",
    unit: "mg/dl",
    normalRange: "<150",
    isAbnormal: true,
  },
  {
    name: "尿酸",
    value: "6.8",
    unit: "mg/dl",
    normalRange: "2.1-7.0",
    isAbnormal: false,
  },
];

// 医療略語データベース
export const medicalAbbreviations: Record<string, {
  expansion: string;
  frequency: number;
  userModifier: number;
  category: string;
}> = {
  "BP": {
    expansion: "血圧 (Blood Pressure)",
    frequency: 9.8,
    userModifier: 1.2,
    category: "vital"
  },
  "HR": {
    expansion: "心拍数 (Heart Rate)",
    frequency: 9.5,
    userModifier: 1.1,
    category: "vital"
  },
  "BT": {
    expansion: "体温 (Body Temperature)",
    frequency: 9.2,
    userModifier: 1.0,
    category: "vital"
  },
  "RR": {
    expansion: "呼吸数 (Respiratory Rate)",
    frequency: 8.8,
    userModifier: 1.0,
    category: "vital"
  },
  "SpO2": {
    expansion: "酸素飽和度 (Oxygen Saturation)",
    frequency: 9.0,
    userModifier: 1.3,
    category: "vital"
  },
  "DM": {
    expansion: "糖尿病 (Diabetes Mellitus)",
    frequency: 8.5,
    userModifier: 1.5,
    category: "diagnosis"
  },
  "HTN": {
    expansion: "高血圧 (Hypertension)",
    frequency: 8.7,
    userModifier: 1.4,
    category: "diagnosis"
  },
  "CAD": {
    expansion: "冠動脈疾患 (Coronary Artery Disease)",
    frequency: 7.8,
    userModifier: 1.2,
    category: "diagnosis"
  },
  "CHF": {
    expansion: "うっ血性心不全 (Congestive Heart Failure)",
    frequency: 7.5,
    userModifier: 1.1,
    category: "diagnosis"
  },
  "COPD": {
    expansion: "慢性閉塞性肺疾患 (Chronic Obstructive Pulmonary Disease)",
    frequency: 7.3,
    userModifier: 1.0,
    category: "diagnosis"
  },
  "CVA": {
    expansion: "脳血管障害 (Cerebrovascular Accident)",
    frequency: 7.0,
    userModifier: 1.1,
    category: "diagnosis"
  },
  "UTI": {
    expansion: "尿路感染症 (Urinary Tract Infection)",
    frequency: 6.8,
    userModifier: 1.0,
    category: "diagnosis"
  },
  "DVT": {
    expansion: "深部静脈血栓症 (Deep Vein Thrombosis)",
    frequency: 6.5,
    userModifier: 1.0,
    category: "diagnosis"
  },
  "PE": {
    expansion: "肺塞栓症 (Pulmonary Embolism)",
    frequency: 6.2,
    userModifier: 1.0,
    category: "diagnosis"
  },
  "ACS": {
    expansion: "急性冠症候群 (Acute Coronary Syndrome)",
    frequency: 7.8,
    userModifier: 1.2,
    category: "diagnosis"
  }
};

// 医療用語データベース
export const medicalTerms: Array<{
  term: string;
  description: string;
  frequency: number;
  userModifier: number;
  category: string;
}> = [
  {
    term: "胸痛",
    description: "胸部の痛み",
    frequency: 9.5,
    userModifier: 1.2,
    category: "symptom"
  },
  {
    term: "呼吸困難",
    description: "息苦しさ",
    frequency: 9.2,
    userModifier: 1.1,
    category: "symptom"
  },
  {
    term: "動悸",
    description: "心拍動の自覚症状",
    frequency: 8.8,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "めまい",
    description: "回転性・浮動性の平衡感覚障害",
    frequency: 8.5,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "頭痛",
    description: "頭部の痛み",
    frequency: 9.0,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "発熱",
    description: "体温上昇",
    frequency: 9.3,
    userModifier: 1.1,
    category: "symptom"
  },
  {
    term: "悪心",
    description: "吐き気",
    frequency: 8.2,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "嘔吐",
    description: "胃内容物の逆流",
    frequency: 8.0,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "腹痛",
    description: "腹部の痛み",
    frequency: 8.7,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "下痢",
    description: "水様便の頻回排出",
    frequency: 8.3,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "便秘",
    description: "排便困難・回数減少",
    frequency: 7.8,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "倦怠感",
    description: "全身の疲労感",
    frequency: 8.5,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "食欲不振",
    description: "食欲の低下",
    frequency: 8.0,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "体重減少",
    description: "意図しない体重の減少",
    frequency: 7.5,
    userModifier: 1.0,
    category: "symptom"
  },
  {
    term: "浮腫",
    description: "組織間隙の体液貯留",
    frequency: 8.2,
    userModifier: 1.0,
    category: "symptom"
  }
];

// SOAPテンプレートデータベース
export const soapTemplates: Record<string, {
  title: string;
  template: string;
  usage: number;
  category: string;
}> = {
  "internal_medicine": {
    title: "内科初診",
    template: `S (Subjective - 主観的情報):
主訴：
現病歴：
既往歴：
家族歴：
生活歴：
アレルギー歴：

O (Objective - 客観的情報):
バイタルサイン：BP _/_mmHg, HR _bpm, BT _℃, RR _/min, SpO2 _%
一般状態：
頭頸部：
胸部：心音整、雑音なし、呼吸音清、ラ音なし
腹部：平坦・軟、圧痛なし、腸音正常
四肢：浮腫なし、チアノーゼなし
神経学的所見：

A (Assessment - 評価・診断):
1. 
2. 
3. 

P (Plan - 計画・治療方針):
検査計画：
治療計画：
患者指導：
次回診察：`,
    usage: 85,
    category: "initial"
  },
  "cardiovascular": {
    title: "循環器外来",
    template: `S (Subjective - 主観的情報):
主訴：胸痛・動悸・呼吸困難など
症状の詳細：
誘因：
持続時間：
随伴症状：

O (Objective - 客観的情報):
バイタルサイン：BP _/_mmHg, HR _bpm, BT _℃, SpO2 _%
心音：I音_, II音_, III音_, IV音_, 心雑音_
肺音：
末梢循環：
心電図所見：
胸部X線所見：

A (Assessment - 評価・診断):
心疾患の評価：
重症度：
リスク評価：

P (Plan - 計画・治療方針):
薬物療法：
生活指導：
追加検査：
フォローアップ：`,
    usage: 78,
    category: "specialty"
  },
  "diabetes": {
    title: "糖尿病外来",
    template: `S (Subjective - 主観的情報):
血糖コントロール状況：
低血糖症状：
食事療法の実施状況：
運動療法の実施状況：
服薬状況：

O (Objective - 客観的情報):
体重：_kg (前回比_kg)
血圧：_/_mmHg
HbA1c：_%
血糖値：_mg/dl
尿検査：糖_, 蛋白_, ケトン_
足部チェック：

A (Assessment - 評価・診断):
糖尿病コントロール状況：
合併症の評価：
治療目標達成度：

P (Plan - 計画・治療方針):
血糖管理：
合併症予防：
生活指導：
次回検査予定：`,
    usage: 72,
    category: "specialty"
  },
  "emergency": {
    title: "救急外来",
    template: `S (Subjective - 主観的情報):
主訴：
発症時刻：
症状の経過：
来院手段：
意識レベル：

O (Objective - 客観的情報):
バイタルサイン：BP _/_mmHg, HR _bpm, BT _℃, RR _/min, SpO2 _%
意識状態：JCS_, GCS_
ABCDEアプローチ：
　A（気道）：
　B（呼吸）：
　C（循環）：
　D（意識）：
　E（体温・環境）：

A (Assessment - 評価・診断):
緊急度：
重症度：
鑑別診断：

P (Plan - 計画・治療方針):
初期治療：
追加検査：
専門科コンサル：
入院の必要性：`,
    usage: 65,
    category: "emergency"
  }
};

// クイック挿入データベース
export const quickInserts: Record<string, {
  items: Array<{
    text: string;
    frequency: number;
    userFrequency: number;
  }>;
}> = {
  "症状": {
    items: [
      { text: "胸痛", frequency: 95, userFrequency: 12 },
      { text: "呼吸困難", frequency: 88, userFrequency: 8 },
      { text: "動悸", frequency: 76, userFrequency: 6 },
      { text: "めまい", frequency: 65, userFrequency: 4 },
      { text: "頭痛", frequency: 82, userFrequency: 5 },
      { text: "腹痛", frequency: 79, userFrequency: 7 },
      { text: "発熱", frequency: 91, userFrequency: 9 },
      { text: "悪心・嘔吐", frequency: 67, userFrequency: 3 },
      { text: "倦怠感", frequency: 72, userFrequency: 6 },
      { text: "食欲不振", frequency: 58, userFrequency: 2 }
    ]
  },
  "所見": {
    items: [
      { text: "心音整、雑音なし", frequency: 92, userFrequency: 15 },
      { text: "呼吸音清", frequency: 89, userFrequency: 13 },
      { text: "腹部平坦・軟", frequency: 85, userFrequency: 11 },
      { text: "浮腫なし", frequency: 78, userFrequency: 8 },
      { text: "圧痛なし", frequency: 73, userFrequency: 7 },
      { text: "チアノーゼなし", frequency: 65, userFrequency: 5 },
      { text: "意識清明", frequency: 87, userFrequency: 9 },
      { text: "眼瞼結膜貧血なし", frequency: 56, userFrequency: 3 },
      { text: "頸部リンパ節腫脹なし", frequency: 52, userFrequency: 2 },
      { text: "皮疹なし", frequency: 48, userFrequency: 1 }
    ]
  },
  "計画": {
    items: [
      { text: "血液検査施行", frequency: 88, userFrequency: 12 },
      { text: "心電図検査", frequency: 82, userFrequency: 10 },
      { text: "胸部X線撮影", frequency: 79, userFrequency: 9 },
      { text: "経過観察", frequency: 76, userFrequency: 8 },
      { text: "生活指導", frequency: 73, userFrequency: 7 },
      { text: "服薬指導", frequency: 69, userFrequency: 6 },
      { text: "再診指示", frequency: 85, userFrequency: 11 },
      { text: "専門科紹介", frequency: 45, userFrequency: 2 },
      { text: "緊急時連絡指示", frequency: 38, userFrequency: 1 },
      { text: "入院検討", frequency: 32, userFrequency: 1 }
    ]
  }
};

// ユーザーアラートのサンプルデータ
export const initialUserAlerts: UserAlert[] = [
  {
    id: 'alert-1',
    type: 'system',
    title: 'システムメンテナンス予定',
    message: '明日23:00-24:00にシステムメンテナンスを実施予定です。',
    priority: 'medium',
    timestamp: '2024-08-08T14:30:00Z',
    dismissed: false,
    userId: currentUser.id
  },
  {
    id: 'alert-2',
    type: 'task',
    title: '未完了のオーダ確認',
    message: '3件の未確定オーダがあります。確認してください。',
    priority: 'high',
    timestamp: '2024-08-08T13:15:00Z',
    dismissed: false,
    userId: currentUser.id
  },
  {
    id: 'alert-3',
    type: 'notification',
    title: '新機能のお知らせ',
    message: 'バイタル・検査グラフ機能が追加されました。',
    priority: 'low',
    timestamp: '2024-08-08T09:00:00Z',
    dismissed: false,
    userId: currentUser.id
  }
];