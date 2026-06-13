export type OrderStatus = '指示受済' | '受付済' | '開始済' | '採取済' | '実施済' | 'レポート作成済';

export type OrderType = '栄養' | '検体検査' | '生理検査' | '内視鏡検査' | '画像検査' | '処置オーダ' | '注射オーダ' | '薬剤' | '処方' | '服薬指導' | 'リハビリ' | '放射線' | '看護指示' | '病理' | '細菌' | '透析';

// 施術内容のタイプ
export type ProcedureType = '診察' | '処方' | '注射' | '処置' | '検体' | '細菌' | '病理' | '生理' | '内視' | '画像' | 'リハ' | '透析' | '手術' | '指導' | '入院';

// ステータス履歴
export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
}

export type ExaminationType = '検体検査' | '生理検査' | '内視鏡検査' | '画像検査';

// 侵襲性の高い処置タイプ
export const INVASIVE_ORDER_TYPES: OrderType[] = ['注射オーダ', '処置オーダ', '内視鏡検査'];

// スピッツ（採血管）の種類
export type SpecimenTubeType = 
  | '紫キャップ' // EDTA (血算用)
  | '黄キャップ' // 分離剤入り (生化学用)
  | '赤キャップ' // 分離剤なし (血清用)
  | '水色キャップ' // クエン酸 (凝固系)
  | '緑キャップ' // ヘパリン (血漿用)
  | '灰色キャップ' // フッ化ナトリウム (血糖用)
  | '黒キャップ' // ESR用
  | 'ホルマリン容器' // 病理用
  | '培養ボトル'; // 細菌培養用

// 薬剤の形態
export type MedicationType = 
  | '錠剤'
  | 'カプセル'
  | '注射剤'
  | '点滴'
  | '内服薬'
  | '軟膏'
  | '貼付剤'
  | '吸入剤'
  | '散剤';

// 視覚的識別情報
export interface VisualIndicator {
  tubeType?: SpecimenTubeType;
  tubeColor?: string; // HEX color code
  medicationType?: MedicationType;
  medicationForm?: string; // 具体的な形状（例：円形白色、カプセル青/白）
  containerType?: 'specimen' | 'culture'; // 検体容器タイプ
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

export type Gender = '男' | '女' | '不明';

export type PatientLocation = '外来' | '入院';

export type Department = '内科' | '外科' | '小児科' | '整形外科' | '産婦人科' | '皮膚科' | '泌尿器科' | '耳鼻咽喉科' | '呼吸器科' | '循環器科';

export interface Allergy {
  id: string;
  component: string;
  severity: '軽度' | '中等度' | '重度';
  symptoms: string;
  registeredDate: string;
  source: string;
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
  category?: string; // 分類（視覚確認の代わり）
  department: Department;
  attendingDoctor?: string; // 担当医
  ward?: string; // 病棟
  roomNumber?: string; // 部屋番号
  procedureType?: ProcedureType; // 施術内容分類
  statusHistory?: StatusHistory[]; // ステータス履歴
  examinationType?: ExaminationType;
  endoscopyDetails?: string;
  visualIndicator?: VisualIndicator; // 視覚的識別情報
  labResults?: LabResults; // 検査結果
  imageUrl?: string;
  receivedAt: string; // 指示受け時刻
  acceptedAt?: string;
  implementedAt?: string;
  acceptedBy?: string;
  implementedBy?: string;
  implementationNotes?: string; // 実施概要
  scheduledTime?: string; // 予定時刻
  medicationRecorded?: boolean; // 薬剤記録が入力済みかどうか
}

export interface ThreePointCheck {
  patientConfirmed: boolean;
  orderConfirmed: boolean;
  allergyConfirmed: boolean;
}

export interface ImplementerInput {
  implementer: string;
  witness?: string;
  location?: string;
  notes?: string;
  implementedAt: string;
  reason?: string;
}

export interface PrescriptionData {
  shouldIssue: boolean;
  prescriptionType?: '院外' | '院内' | '麻薬';
  skipReason?: string;
  jobId?: string;
}