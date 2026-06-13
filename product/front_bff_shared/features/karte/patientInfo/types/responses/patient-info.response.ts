/** メタデータ（作成者・更新者） */
export interface RecordMetaResponse {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}


export interface BasicInfoResponse {
  patientId: string;
  name: string;
  nameKana: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  bloodType: 'A' | 'B' | 'O' | 'AB' | 'unknown';
  insuranceNumber: string;
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

export interface AllergyRecordResponse {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  confirmedDate: string;
  meta: RecordMetaResponse;
}

export interface MedicalHistoryRecordResponse {
  id: string;
  disease: string;
  diagnosisDate: string;
  hospital: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface SurgeryRecordResponse {
  id: string;
  surgeryName: string;
  surgeryDate: string;
  hospital: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface AllergyHistoryResponse {
  allergies: AllergyRecordResponse[];
  medicalHistories: MedicalHistoryRecordResponse[];
  surgeries: SurgeryRecordResponse[];
}

export interface VaccinationRecordResponse {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  lotNumber: string;
  administrator: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface FamilyMemberRecordResponse {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  isEmergencyContact: boolean;
  meta: RecordMetaResponse;
}

export interface GuarantorInfoResponse {
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  occupation: string;
}

export interface FamilyInfoResponse {
  familyMembers: FamilyMemberRecordResponse[];
  guarantor: GuarantorInfoResponse;
}

export interface InfectionRecordResponse {
  id: string;
  infectionName: string;
  testDate: string;
  result: 'positive' | 'negative' | 'unknown';
  memo: string;
  meta: RecordMetaResponse;
}

export interface PacemakerRecordResponse {
  id: string;
  deviceName: string;
  manufacturer: string;
  implantDate: string;
  serialNumber: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface AneurysmClipRecordResponse {
  id: string;
  location: string;
  implantDate: string;
  hospital: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface MetalImplantRecordResponse {
  id: string;
  partName: string;
  materialName: string;
  implantDate: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface ImplantDeviceResponse {
  pacemakers: PacemakerRecordResponse[];
  aneurysmClips: AneurysmClipRecordResponse[];
  metalImplants: MetalImplantRecordResponse[];
}

export interface LifestyleResponse {
  smokingStatus: 'never' | 'former' | 'current';
  smokingDetail: string;
  alcoholStatus: 'never' | 'occasional' | 'regular';
  alcoholDetail: string;
  exerciseHabit: string;
  sleepHours: string;
  dietRestriction: string;
  memo: string;
  meta: RecordMetaResponse;
}

export interface MedicalMemoRecordResponse {
  id: string;
  category: string;
  content: string;
  isImportant: boolean;
  meta: RecordMetaResponse;
}

export interface PhilosophyRecordResponse {
  id: string;
  endOfLifeWish: string;
  resuscitationWish: 'do' | 'doNot' | 'undecided';
  artificialNutritionWish: 'do' | 'doNot' | 'undecided';
  mechanicalVentilationWish: 'do' | 'doNot' | 'undecided';
  decisionMaker: string;
  decisionMakerPhone: string;
  memo: string;
  isLatest: boolean;
  meta: RecordMetaResponse;
}

export interface VipSettingResponse {
  isVip: boolean;
  restrictionLevel: 'none' | 'partial' | 'full';
  memo: string;
  meta: RecordMetaResponse;
}

export interface UserAccessRecordResponse {
  id: string;
  userId: string;
  userName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  canView: boolean;
  canEdit: boolean;
  grantedBy: string;
  grantedAt: string;
}

export interface AccessControlResponse {
  vipSetting: VipSettingResponse;
  userAccesses: UserAccessRecordResponse[];
}

/** BFF → フロントエンド 患者記録情報レスポンス */
export interface PatientInfoResponse {
  basicInfo: BasicInfoResponse;
  allergyHistory: AllergyHistoryResponse;
  vaccinations: VaccinationRecordResponse[];
  familyInfo: FamilyInfoResponse;
  infections: InfectionRecordResponse[];
  implantDevices: ImplantDeviceResponse;
  lifestyle: LifestyleResponse;
  medicalMemos: MedicalMemoRecordResponse[];
  philosophies: PhilosophyRecordResponse[];
  accessControl: AccessControlResponse;
}

export interface GetPatientInfoResponse {
  patientInfo: PatientInfoResponse;
}
