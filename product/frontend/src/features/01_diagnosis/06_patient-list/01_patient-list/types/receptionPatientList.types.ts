export type PatientCategory = '紹介' | '健診' | '当日' | '救急' | '';
export type PatientType = '初診' | '再診';
export type PatientGender = '男' | '女';
export type SpecimenStatus = 0 | 1 | 2 | 3 | null;

export interface PatientStatus {
  consultation: boolean | null;
  prescription: boolean | null;
  injection: boolean | null;
  treatment: boolean | null;
  specimen: SpecimenStatus;
  bacteria: SpecimenStatus;
  pathology: SpecimenStatus;
  physiology: boolean | null;
  endoscopy: boolean | null;
  imaging: boolean | null;
  rehabilitation: boolean | null;
  dialysis: boolean | null;
  surgery: boolean | null;
  guidance: boolean | null;
}

export interface Patient {
  id: string;
  category: PatientCategory;
  type: PatientType;
  receptionTime: string;
  appointmentSlot: string;
  patientId: string;
  name: string;
  kana: string;
  birthDate: string;
  gender: PatientGender;
  age: number;
  medicalCategory: string;
  memo: string;
  multiDepartment: boolean;
  remarks: string;
  status: PatientStatus;
  paymentComplete: boolean;
  consultationComplete: boolean;
  isReservation: boolean;
  doctorId: string;
  departmentId: string;
  date: string;
}

export interface FilterState {
  date: string;
  showCompleted: boolean;
  showReservations: boolean;
  doctorIds: string[];
  departmentId: string;
}

export type SortColumn =
  | 'category'
  | 'type'
  | 'receptionTime'
  | 'appointmentSlot'
  | 'patientId'
  | 'name'
  | 'kana'
  | 'birthDate'
  | 'gender'
  | 'age'
  | 'department'
  | 'medicalCategory'
  | 'memo'
  | 'multiDepartment'
  | 'remarks'
  | 'consultation'
  | 'prescription'
  | 'injection'
  | 'treatment'
  | 'specimen'
  | 'bacteria'
  | 'pathology'
  | 'physiology'
  | 'endoscopy'
  | 'imaging'
  | 'rehabilitation'
  | 'dialysis'
  | 'surgery'
  | 'guidance'
  | 'paymentComplete';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}

export interface Doctor {
  id: string;
  name: string;
  departmentIds: string[];
  mainDepartmentId: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface ReceptionStats {
  consulted: number;
  recepted: number;
  target: number;
}
