// 部門指示受け共通 ViewModel 型定義
// 複数部門（DEP001〜DEP011）で共有する型。部門固有型は各LV3の types/ に定義する。

export type OrderStatus =
  // 検体検査用
  | 'received' | 'accepted' | 'started' | 'collected' | 'specimen_received'
  // 病理・細菌検査用
  | 'awaiting_result'
  // 共通
  | 'implemented' | 'result_entered';

export type OrderType =
  | 'NUTRITION'
  | 'SPECIMEN_TEST'
  | 'PHYSIOLOGICAL_TEST'
  | 'ENDOSCOPY'
  | 'IMAGING'
  | 'PROCEDURE'
  | 'INJECTION'
  | 'MEDICATION'
  | 'PRESCRIPTION'
  | 'MEDICATION_GUIDANCE'
  | 'REHABILITATION'
  | 'RADIOLOGY'
  | 'NURSING'
  | 'PATHOLOGY'
  | 'BACTERIA'
  | 'DIALYSIS'
  | 'GENERIC';

// オーダー種別ごとの利用可能ステータス
export const ORDER_TYPE_STATUSES: Record<OrderType, OrderStatus[]> = {
  SPECIMEN_TEST:      ['received', 'accepted', 'started', 'collected', 'specimen_received', 'implemented', 'result_entered'],
  PHYSIOLOGICAL_TEST: ['started', 'implemented', 'result_entered'],
  PATHOLOGY:          ['received', 'collected', 'awaiting_result', 'implemented', 'result_entered'],
  BACTERIA:           ['received', 'collected', 'awaiting_result', 'implemented', 'result_entered'],
  ENDOSCOPY:          ['received', 'accepted', 'implemented'],
  IMAGING:            ['received', 'accepted', 'implemented'],
  PROCEDURE:          ['received', 'accepted', 'implemented'],
  INJECTION:          ['received', 'implemented'],
  MEDICATION:         ['received', 'implemented'],
  PRESCRIPTION:       ['received', 'implemented'],
  MEDICATION_GUIDANCE:['received', 'implemented'],
  NUTRITION:          ['received', 'implemented'],
  REHABILITATION:     ['received', 'accepted', 'implemented'],
  RADIOLOGY:          ['received', 'accepted', 'implemented'],
  NURSING:            ['received', 'implemented'],
  DIALYSIS:           ['received', 'accepted', 'implemented'],
  GENERIC:            ['received', 'accepted', 'implemented'],
};

export type ExaminationType = 'SPECIMEN_TEST' | 'PHYSIOLOGICAL_TEST' | 'ENDOSCOPY' | 'IMAGING';

// 侵襲性の高い処置タイプ
export const INVASIVE_ORDER_TYPES: OrderType[] = ['INJECTION', 'PROCEDURE', 'ENDOSCOPY'];

// スピッツ（採血管）の種類
export type SpecimenTubeType =
  | 'PURPLE_CAP'         // EDTA (血算用)
  | 'YELLOW_CAP'         // 分離剤入り (生化学用)
  | 'RED_CAP'            // 分離剤なし (血清用)
  | 'LIGHT_BLUE_CAP'     // クエン酸 (凝固系)
  | 'GREEN_CAP'          // ヘパリン (血漿用)
  | 'GRAY_CAP'           // フッ化ナトリウム (血糖用)
  | 'BLACK_CAP'          // ESR用
  | 'FORMALIN_CONTAINER' // 病理用
  | 'CULTURE_BOTTLE';    // 細菌培養用

// 薬剤の形態
export type MedicationType =
  | 'TABLET'
  | 'CAPSULE'
  | 'INJECTION'
  | 'DRIP'
  | 'INTERNAL'
  | 'OINTMENT'
  | 'PATCH'
  | 'INHALER'
  | 'POWDER';

// 生理検査の種類
export type PhysiologicalTestType =
  | 'ECG'
  | 'PULMONARY'
  | 'EEG'
  | 'ULTRASOUND'
  | 'ECHOCARDIOGRAM'
  | 'AUDIOMETRY'
  | 'FUNDUS';

// 視覚的識別情報
export interface VisualIndicator {
  tubeType?: SpecimenTubeType;
  tubeColor?: string; // HEX color code
  medicationType?: MedicationType;
  medicationForm?: string; // 具体的な形状（例：円形白色、カプセル青/白）
  containerType?: 'specimen' | 'culture'; // 検体容器タイプ
  physiologicalTestType?: PhysiologicalTestType; // 生理検査タイプ
}

// 検査結果
export interface TestResult {
  itemName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  abnormalLevel?: 'high' | 'low' | 'critical';
}

export interface LabResults {
  results: TestResult[];
  notes: string;
  enteredAt: string;
  enteredBy: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export type PatientLocation = 'OUTPATIENT' | 'INPATIENT';

export type Department =
  | 'INTERNAL_MEDICINE'
  | 'SURGERY'
  | 'PEDIATRICS'
  | 'ORTHOPEDICS'
  | 'OBSTETRICS'
  | 'DERMATOLOGY'
  | 'UROLOGY'
  | 'OTOLARYNGOLOGY'
  | 'RESPIRATORY'
  | 'CARDIOLOGY';

export type AllergyCategory = 'MEDICATION' | 'FOOD' | 'ENVIRONMENT' | 'LATEX' | 'METAL' | 'OTHER';

export interface Allergy {
  id: string;
  component: string;
  category: AllergyCategory;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  symptoms: string;
  registeredDate: string;
  source: string;
}

// ステータス履歴
export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  patientId: string;
  patientName: string;
  patientKana: string;
  gender: Gender;
  birthDate: string;
  age: number;
  orderType: OrderType;
  content: string;
  allergies: Allergy[];
  hasAllergies: boolean;
  location: PatientLocation;
  department: Department;
  attendingDoctor?: string;
  ward?: string;
  roomNumber?: string;
  procedureType?: string; // 施術内容分類（部門固有型を受け入れるため string）
  statusHistory?: StatusHistory[];
  examinationType?: ExaminationType;
  endoscopyDetails?: string;
  visualIndicator?: VisualIndicator | VisualIndicator[];
  labResults?: LabResults;
  labTestLocation?: string;
  imageTestType?: string;
  physiologicalTestType?: string;
  imageUrl?: string;
  receivedAt: string;
  acceptedAt?: string;
  implementedAt?: string;
  acceptedBy?: string;
  implementedBy?: string;
  implementationNotes?: string;
  scheduledTime?: string;
  materialRecorded?: boolean;
}

export interface ImplementerInput {
  implementer: string;
  witness?: string;
  location?: string;
  notes?: string;
  implementedAt: string;
  reason?: string;
}

// 使用機材・薬剤
export interface MaterialItem {
  id: string;
  type: 'MEDICATION' | 'EQUIPMENT';
  name: string;
  quantity: string;
  unit: string;
}

export interface MaterialRecord {
  materials: MaterialItem[];
  recordedAt: string;
  recordedBy: string;
}

export interface PrescriptionData {
  shouldIssue: boolean;
  prescriptionType?: 'OUTPATIENT' | 'INPATIENT' | 'NARCOTIC';
  skipReason?: string;
  jobId?: string;
}
