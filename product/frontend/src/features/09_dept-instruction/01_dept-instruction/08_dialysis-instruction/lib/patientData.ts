// 患者IDと患者情報のマッピング
export interface PatientInfo {
  patientId: string;
  patientName: string;
  patientKana: string;
  gender: string;
  birthDate: string;
  age: number;
}

export const patientDatabase: Map<string, PatientInfo> = new Map([
  ['P00012370', {
    patientId: 'P00012370',
    patientName: '田辺 正雄',
    patientKana: 'タナベ マサオ',
    gender: '男',
    birthDate: '1960/02/15',
    age: 65
  }],
  ['P00012371', {
    patientId: 'P00012371',
    patientName: '井上 和子',
    patientKana: 'イノウエ カズコ',
    gender: '女',
    birthDate: '1968/12/03',
    age: 56
  }],
  ['P00012372', {
    patientId: 'P00012372',
    patientName: '山口 健太郎',
    patientKana: 'ヤマグチ ケンタロウ',
    gender: '男',
    birthDate: '1955/09/22',
    age: 70
  }]
]);

// 患者IDから患者情報を取得する関数
export function getPatientInfo(patientId: string): PatientInfo | undefined {
  return patientDatabase.get(patientId);
}
