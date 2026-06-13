export interface ProxyInputData {
  id: number;
  patientName: string;
  inputBy: string;
  doctorId: number;
  hoursAgo: number;
  isOverdue: boolean;
}

export interface DoctorUnapproved {
  doctorId: number;
  doctorName: string;
  unapprovedCount: number;
}

export interface TemporarySaveData {
  id: number;
  patientName: string;
  recordType: string;
  savedBy: string;
  hoursAgo: number;
  status: string;
}

// 医師データ
export const doctorsData = [
  { doctorId: 1, doctorName: "田中 一郎" },
  { doctorId: 2, doctorName: "鈴木 美香" },
  { doctorId: 3, doctorName: "佐藤 健二" },
  { doctorId: 4, doctorName: "高橋 京子" },
  { doctorId: 5, doctorName: "山田 太郎" },
];

// 代行入力ダミーデータ
export const proxyInputsData: ProxyInputData[] = [
  {
    id: 1,
    patientName: "山田 太郎",
    inputBy: "看護師 佐藤",
    doctorId: 1,
    hoursAgo: 30,
    isOverdue: true,
  },
  {
    id: 2,
    patientName: "田中 花子",
    inputBy: "看護師 鈴木",
    doctorId: 1,
    hoursAgo: 26,
    isOverdue: true,
  },
  {
    id: 3,
    patientName: "佐々木 次郎",
    inputBy: "看護師 高橋",
    doctorId: 2,
    hoursAgo: 5,
    isOverdue: false,
  },
  {
    id: 4,
    patientName: "伊藤 美咲",
    inputBy: "看護師 渡辺",
    doctorId: 3,
    hoursAgo: 12,
    isOverdue: false,
  },
  {
    id: 5,
    patientName: "中村 健太",
    inputBy: "看護師 小林",
    doctorId: 2,
    hoursAgo: 8,
    isOverdue: false,
  },
  {
    id: 6,
    patientName: "小川 明美",
    inputBy: "看護師 加藤",
    doctorId: 4,
    hoursAgo: 15,
    isOverdue: false,
  },
  {
    id: 7,
    patientName: "松本 一郎",
    inputBy: "看護師 山本",
    doctorId: 1,
    hoursAgo: 3,
    isOverdue: false,
  },
  {
    id: 8,
    patientName: "木村 さくら",
    inputBy: "看護師 田村",
    doctorId: 1,
    hoursAgo: 6,
    isOverdue: false,
  },
  {
    id: 9,
    patientName: "森 健一",
    inputBy: "看護師 中島",
    doctorId: 1,
    hoursAgo: 10,
    isOverdue: false,
  },
  {
    id: 10,
    patientName: "橋本 真由美",
    inputBy: "看護師 井上",
    doctorId: 1,
    hoursAgo: 14,
    isOverdue: false,
  },
  {
    id: 11,
    patientName: "清水 博",
    inputBy: "看護師 青木",
    doctorId: 1,
    hoursAgo: 18,
    isOverdue: false,
  },
];

// 一時保存データダミーデータ
export const temporarySaveData: TemporarySaveData[] = [
  {
    id: 1,
    patientName: "吉田 目子",
    recordType: "外来カルテ",
    savedBy: "看護師 佐藤",
    hoursAgo: 2,
    status: "診察所見入力途中",
  },
  {
    id: 2,
    patientName: "高木 大輔",
    recordType: "処方オーダー",
    savedBy: "看護師 森本",
    hoursAgo: 4,
    status: "薬剤選択途中",
  },
  {
    id: 3,
    patientName: "吉田 春香",
    recordType: "検査オーダー",
    savedBy: "看護師 高橋",
    hoursAgo: 6,
    status: "血液検査選択中",
  },
  {
    id: 4,
    patientName: "渡辺 誠",
    recordType: "入院カルテ",
    savedBy: "看護師 田中",
    hoursAgo: 1,
    status: "入院時録録入力中",
  },
  {
    id: 5,
    patientName: "向本 美咲",
    recordType: "画像オーダー",
    savedBy: "看護師 小林",
    hoursAgo: 8,
    status: "X線撮影部位選択中",
  },
  {
    id: 6,
    patientName: "三浦 健太郎",
    recordType: "外来カルテ",
    savedBy: "看護師 青木",
    hoursAgo: 3,
    status: "既往歴入力途中",
  },
];

// 医師毎の未承認数を計算する関数
export function getDoctorUnapprovedSummary(): DoctorUnapproved[] {
  const summary: DoctorUnapproved[] = doctorsData.map((doctor) => ({
    doctorId: doctor.doctorId,
    doctorName: doctor.doctorName,
    unapprovedCount: 0,
  }));

  proxyInputsData.forEach((input) => {
    const doctor = summary.find((d) => d.doctorId === input.doctorId);
    if (doctor) {
      doctor.unapprovedCount++;
    }
  });

  return summary;
}