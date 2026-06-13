export interface PatientStatusResponse {
  consultation: boolean | null;
  prescription: boolean | null;
  injection: boolean | null;
  treatment: boolean | null;
  specimen: 0 | 1 | 2 | 3 | null;
  bacteria: 0 | 1 | 2 | 3 | null;
  pathology: 0 | 1 | 2 | 3 | null;
  physiology: boolean | null;
  endoscopy: boolean | null;
  imaging: boolean | null;
  rehabilitation: boolean | null;
  dialysis: boolean | null;
  surgery: boolean | null;
  guidance: boolean | null;
}

export interface ReceptionPatientResponse {
  id: string;
  category: '紹介' | '健診' | '当日' | '救急' | '';
  type: '初診' | '再診';
  receptionTime: string;
  appointmentSlot: string;
  patientId: string;
  name: string;
  kana: string;
  birthDate: string;
  gender: '男' | '女';
  age: number;
  medicalCategory: string;
  memo: string;
  multiDepartment: boolean;
  remarks: string;
  status: PatientStatusResponse;
  paymentComplete: boolean;
  consultationComplete: boolean;
  isReservation: boolean;
  doctorId: string;
  departmentId: string;
  date: string;
}

export interface ReceptionStatsResponse {
  consulted: number;
  recepted: number;
  target: number;
}

export interface GetReceptionPatientsResponse {
  patients: ReceptionPatientResponse[];
  stats: ReceptionStatsResponse;
}
