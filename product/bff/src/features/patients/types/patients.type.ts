/** 上流 API（患者マスタ）から返却される生データ */
export interface UpstreamPatient {
  patientId: string;
  patientName: string;
  allergyList?: { code: string; name: string }[];
  birthDate?: string;
  renalFunction?: { ccrValue: number };
  conditions?: {
    pregnancyFlag?: boolean;
    renalImpairmentFlag?: boolean;
    hepaticImpairmentFlag?: boolean;
  };
}

/** 上流 API（患者記録情報）から返却される生データ
 * TODO: 上流 API 実装後にフィールド名が diverge した場合に更新すること
 */
export interface UpstreamRecordMeta {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface UpstreamBasicInfo {
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

export interface UpstreamAllergyRecord {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  confirmedDate: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamMedicalHistoryRecord {
  id: string;
  disease: string;
  diagnosisDate: string;
  hospital: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamSurgeryRecord {
  id: string;
  surgeryName: string;
  surgeryDate: string;
  hospital: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamAllergyHistory {
  allergies: UpstreamAllergyRecord[];
  medicalHistories: UpstreamMedicalHistoryRecord[];
  surgeries: UpstreamSurgeryRecord[];
}

export interface UpstreamVaccinationRecord {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  lotNumber: string;
  administrator: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamFamilyMemberRecord {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  isEmergencyContact: boolean;
  meta: UpstreamRecordMeta;
}

export interface UpstreamGuarantorInfo {
  name: string;
  relationship: string;
  birthDate: string;
  phone: string;
  address: string;
  occupation: string;
}

export interface UpstreamFamilyInfo {
  familyMembers: UpstreamFamilyMemberRecord[];
  guarantor: UpstreamGuarantorInfo;
}

export interface UpstreamInfectionRecord {
  id: string;
  infectionName: string;
  testDate: string;
  result: 'positive' | 'negative' | 'unknown';
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamPacemakerRecord {
  id: string;
  deviceName: string;
  manufacturer: string;
  implantDate: string;
  serialNumber: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamAneurysmClipRecord {
  id: string;
  location: string;
  implantDate: string;
  hospital: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamMetalImplantRecord {
  id: string;
  partName: string;
  materialName: string;
  implantDate: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamImplantDevice {
  pacemakers: UpstreamPacemakerRecord[];
  aneurysmClips: UpstreamAneurysmClipRecord[];
  metalImplants: UpstreamMetalImplantRecord[];
}

export interface UpstreamLifestyle {
  smokingStatus: 'never' | 'former' | 'current';
  smokingDetail: string;
  alcoholStatus: 'never' | 'occasional' | 'regular';
  alcoholDetail: string;
  exerciseHabit: string;
  sleepHours: string;
  dietRestriction: string;
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamMedicalMemoRecord {
  id: string;
  category: string;
  content: string;
  isImportant: boolean;
  meta: UpstreamRecordMeta;
}

export interface UpstreamPhilosophyRecord {
  id: string;
  endOfLifeWish: string;
  resuscitationWish: 'do' | 'doNot' | 'undecided';
  artificialNutritionWish: 'do' | 'doNot' | 'undecided';
  mechanicalVentilationWish: 'do' | 'doNot' | 'undecided';
  decisionMaker: string;
  decisionMakerPhone: string;
  memo: string;
  isLatest: boolean;
  meta: UpstreamRecordMeta;
}

export interface UpstreamVipSetting {
  isVip: boolean;
  restrictionLevel: 'none' | 'partial' | 'full';
  memo: string;
  meta: UpstreamRecordMeta;
}

export interface UpstreamUserAccessRecord {
  id: string;
  userId: string;
  userName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  canView: boolean;
  canEdit: boolean;
  grantedBy: string;
  grantedAt: string;
}

export interface UpstreamAccessControl {
  vipSetting: UpstreamVipSetting;
  userAccesses: UpstreamUserAccessRecord[];
}

export interface UpstreamPatientInfo {
  basicInfo: UpstreamBasicInfo;
  allergyHistory: UpstreamAllergyHistory;
  vaccinations: UpstreamVaccinationRecord[];
  familyInfo: UpstreamFamilyInfo;
  infections: UpstreamInfectionRecord[];
  implantDevices: UpstreamImplantDevice;
  lifestyle: UpstreamLifestyle;
  medicalMemos: UpstreamMedicalMemoRecord[];
  philosophies: UpstreamPhilosophyRecord[];
  accessControl: UpstreamAccessControl;
}
