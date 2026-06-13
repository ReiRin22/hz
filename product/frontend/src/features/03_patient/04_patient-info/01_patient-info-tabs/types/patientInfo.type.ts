export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff';

export interface RecordMeta {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

// 基本情報タブ
export interface BasicInfoRecord {
  // 他システム連携フィールド（read-only）
  patientId: string;
  name: string;
  nameKana: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  bloodType: 'A' | 'B' | 'O' | 'AB' | 'unknown';
  insuranceNumber: string;
  // 編集可能フィールド
  address: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  occupation: string;
  nationality: string;
  religion: string;
  primaryDiagnosis: string;
  admissionDate: string;
  ward: string;
  room: string;
}

// アレルギー/既往歴/手術歴タブ
export interface AllergyRecord {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  confirmedDate: string;
  meta: RecordMeta;
}

export interface MedicalHistoryRecord {
  id: string;
  disease: string;
  diagnosisDate: string;
  hospital: string;
  memo: string;
  meta: RecordMeta;
}

export interface SurgeryRecord {
  id: string;
  surgeryName: string;
  surgeryDate: string;
  hospital: string;
  memo: string;
  meta: RecordMeta;
}

export interface AllergyHistoryData {
  allergies: AllergyRecord[];
  medicalHistories: MedicalHistoryRecord[];
  surgeries: SurgeryRecord[];
}

// 予防接種タブ
export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  lotNumber: string;
  administrator: string;
  memo: string;
  meta: RecordMeta;
}

// 家族情報タブ
export interface FamilyMemberRecord {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  isEmergencyContact: boolean;
  meta: RecordMeta;
}

export interface GuarantorInfo {
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  occupation: string;
}

export interface FamilyInfoData {
  familyMembers: FamilyMemberRecord[];
  guarantor: GuarantorInfo;
}

// 感染症タブ
export interface InfectionRecord {
  id: string;
  infectionName: string;
  testDate: string;
  result: 'positive' | 'negative' | 'unknown';
  memo: string;
  meta: RecordMeta;
}

// 体内埋込デバイスタブ
export interface PacemakerRecord {
  id: string;
  deviceName: string;
  manufacturer: string;
  implantDate: string;
  serialNumber: string;
  memo: string;
  meta: RecordMeta;
}

export interface AneurysmClipRecord {
  id: string;
  location: string;
  implantDate: string;
  hospital: string;
  memo: string;
  meta: RecordMeta;
}

export interface MetalImplantRecord {
  id: string;
  partName: string;
  materialName: string;
  implantDate: string;
  memo: string;
  meta: RecordMeta;
}

export interface ImplantDeviceData {
  pacemakers: PacemakerRecord[];
  aneurysmClips: AneurysmClipRecord[];
  metalImplants: MetalImplantRecord[];
}

// 生活習慣タブ
export interface LifestyleRecord {
  smokingStatus: 'never' | 'former' | 'current';
  smokingDetail: string;
  alcoholStatus: 'never' | 'occasional' | 'regular';
  alcoholDetail: string;
  exerciseHabit: string;
  sleepHours: string;
  dietRestriction: string;
  memo: string;
  meta: RecordMeta;
}

// 医療メモタブ
export interface MedicalMemoRecord {
  id: string;
  category: string;
  content: string;
  isImportant: boolean;
  meta: RecordMeta;
}

// ACP/人生の最終段階の方針タブ
export interface PhilosophyRecord {
  id: string;
  endOfLifeWish: string;
  resuscitationWish: 'do' | 'doNot' | 'undecided';
  artificialNutritionWish: 'do' | 'doNot' | 'undecided';
  mechanicalVentilationWish: 'do' | 'doNot' | 'undecided';
  decisionMaker: string;
  decisionMakerPhone: string;
  memo: string;
  isLatest: boolean;
  meta: RecordMeta;
}

// アクセス制御タブ
export interface VipSetting {
  isVip: boolean;
  restrictionLevel: 'none' | 'partial' | 'full';
  memo: string;
  meta: RecordMeta;
}

export interface UserAccessRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  canView: boolean;
  canEdit: boolean;
  grantedBy: string;
  grantedAt: string;
}

export interface AccessControlData {
  vipSetting: VipSetting;
  userAccesses: UserAccessRecord[];
}

// 全タブを集約した型
export interface PatientInfoData {
  basicInfo: BasicInfoRecord;
  allergyHistory: AllergyHistoryData;
  vaccinations: VaccinationRecord[];
  familyInfo: FamilyInfoData;
  infections: InfectionRecord[];
  implantDevices: ImplantDeviceData;
  lifestyle: LifestyleRecord;
  medicalMemos: MedicalMemoRecord[];
  philosophies: PhilosophyRecord[];
  accessControl: AccessControlData;
}
