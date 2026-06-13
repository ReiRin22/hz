// 患者情報関連の型定義

export interface Patient {
  id: string;
  name: string;
  kana: string;
  birthDate: string;
  gender: string;
}

export interface CurrentPatient extends Patient {
  age?: string;
  department?: string;
  doctor?: string;
}
