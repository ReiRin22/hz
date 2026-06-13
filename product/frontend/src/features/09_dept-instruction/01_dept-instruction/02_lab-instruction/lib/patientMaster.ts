// 患者マスターデータ
export interface Patient {
  patientId: string;
  patientName: string;
  patientKana: string;
  gender: '男' | '女';
  birthDate: string;
  age: number;
}

export const patientMasterData: Patient[] = [
  {
    patientId: 'P00012345',
    patientName: '山田 太郎',
    patientKana: 'ヤマダ タロウ',
    gender: '男',
    birthDate: '1965/04/15',
    age: 60
  },
  {
    patientId: 'P00012346',
    patientName: '佐藤 花子',
    patientKana: 'サトウ ハナコ',
    gender: '女',
    birthDate: '1978/08/22',
    age: 47
  },
  {
    patientId: 'P00012347',
    patientName: '鈴木 一郎',
    patientKana: 'スズキ イチロウ',
    gender: '男',
    birthDate: '1990/12/05',
    age: 35
  },
  {
    patientId: 'P00012348',
    patientName: '高橋 美咲',
    patientKana: 'タカハシ ミサキ',
    gender: '女',
    birthDate: '1985/03/18',
    age: 40
  },
  {
    patientId: 'P00012349',
    patientName: '伊藤 健太',
    patientKana: 'イトウ ケンタ',
    gender: '男',
    birthDate: '1972/09/30',
    age: 53
  },
  {
    patientId: 'P00012350',
    patientName: '渡辺 由美',
    patientKana: 'ワタナベ ユミ',
    gender: '女',
    birthDate: '1988/06/12',
    age: 37
  },
  {
    patientId: 'P00012351',
    patientName: '松本 龍一',
    patientKana: 'マツモト リュウイチ',
    gender: '男',
    birthDate: '1955/11/28',
    age: 70
  },
  {
    patientId: 'P00012352',
    patientName: '中村 春香',
    patientKana: 'ナカムラ ハルカ',
    gender: '女',
    birthDate: '1995/05/12',
    age: 30
  },
  {
    patientId: 'P00012353',
    patientName: '小林 誠',
    patientKana: 'コバヤシ マコト',
    gender: '男',
    birthDate: '1980/02/20',
    age: 45
  },
  {
    patientId: 'P00012354',
    patientName: '加藤 奈々',
    patientKana: 'カトウ ナナ',
    gender: '女',
    birthDate: '1992/08/08',
    age: 33
  },
  {
    patientId: 'P00012355',
    patientName: '吉田 浩二',
    patientKana: 'ヨシダ コウジ',
    gender: '男',
    birthDate: '1963/07/15',
    age: 62
  },
  {
    patientId: 'P00012356',
    patientName: '木村 良子',
    patientKana: 'キムラ ヨシコ',
    gender: '女',
    birthDate: '1980/06/10',
    age: 45
  },
  {
    patientId: 'P00012357',
    patientName: '斎藤 明',
    patientKana: 'サイトウ アキラ',
    gender: '男',
    birthDate: '1952/03/22',
    age: 73
  },
  {
    patientId: 'P00012358',
    patientName: '山口 恵子',
    patientKana: 'ヤマグチ ケイコ',
    gender: '女',
    birthDate: '1975/10/05',
    age: 50
  },
  {
    patientId: 'P00012359',
    patientName: '池田 和夫',
    patientKana: 'イケダ カズオ',
    gender: '男',
    birthDate: '1968/07/14',
    age: 57
  },
  {
    patientId: 'P00012360',
    patientName: '森 千鶴',
    patientKana: 'モリ チヅル',
    gender: '女',
    birthDate: '1987/04/25',
    age: 38
  }
];

// 患者IDから患者情報を検索する関数
export function findPatientById(patientId: string): Patient | null {
  return patientMasterData.find(patient => patient.patientId === patientId) || null;
}
