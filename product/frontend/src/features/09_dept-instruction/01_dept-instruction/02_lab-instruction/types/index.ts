export type OrderStatus = 
  // 検体検査用
  | '指示受済' | '受付済' | '開始済' | '採取済' | '検体受領済' 
  // 生理検査用は「開始済」から開始
  // 病理・細菌検査用
  | '結果待ち'
  // 共通
  | '実施済' | '結果入力済';

export type OrderType = '栄養' | '検体検査' | '生理検査' | '内視鏡検査' | '画像検査' | '処置オーダ' | '注射オーダ' | '薬剤' | '処方' | '服薬指導' | 'リハビリ' | '放射線' | '看護指示' | '病理' | '細菌' | '透析';

// 施術内容のタイプ
export type ProcedureType = '診察' | '処方' | '注射' | '処置' | '検体' | '細菌' | '病理' | '生理' | '内視' | '画像' | 'リハ' | '透析' | '手術' | '指導' | '入院';

// オーダー種別ごとの利用可能ステータス
export const ORDER_TYPE_STATUSES: Record<OrderType, OrderStatus[]> = {
  '検体検査': ['指示受済', '受付済', '開始済', '採取済', '検体受領済', '実施済', '結果入力済'],
  '生理検査': ['受付済', '開始済', '実施済', '結果入力済'],
  '病理': ['採取済', '結果待ち', '実施済', '結果入力済'],
  '細菌': ['採取済', '結果待ち', '実施済', '結果入力済'],
  '内視鏡検査': ['指示受済', '受付済', '実施済'],
  '画像検査': ['指示受済', '受付済', '実施済'],
  '処置オーダ': ['指示受済', '受付済', '実施済'],
  '注射オーダ': ['指示受済', '実施済'],
  '薬剤': ['指示受済', '実施済'],
  '処方': ['指示受済', '実施済'],
  '服薬指導': ['指示受済', '実施済'],
  '栄養': ['指示受済', '実施済'],
  'リハビリ': ['指示受済', '受付済', '実施済'],
  '放射線': ['指示受済', '受付済', '実施済'],
  '看護指示': ['指示受済', '実施済'],
  '透析': ['指示受済', '受付済', '実施済']
};

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

// 生理検査の種類
export type PhysiologicalTestType =
  | '心電図'
  | '肺機能検査'
  | '脳波検査'
  | '超音波検査'
  | '心エコー'
  | '聴力検査'
  | '眼底検査';

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

export type Gender = '男' | '女' | '不明';

export type PatientLocation = '外来' | '入院';

export type Department = '内科' | '外科' | '小児科' | '整形外科' | '産婦人科' | '皮膚科' | '泌尿器科' | '耳鼻咽喉科' | '呼吸器科' | '循環器科';

export type AllergyCategory = '薬剤' | '食物' | '環境' | 'ラテックス' | '金属' | 'その他';

export interface Allergy {
  id: string;
  component: string;
  category: AllergyCategory;
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
  department: Department;
  attendingDoctor?: string; // 担当医
  ward?: string; // 病棟
  roomNumber?: string; // 部屋番号
  procedureType?: ProcedureType; // 施術内容分類
  statusHistory?: StatusHistory[]; // ステータス履歴
  examinationType?: ExaminationType;
  endoscopyDetails?: string;
  visualIndicator?: VisualIndicator | VisualIndicator[]; // 視覚的識別情報（単一または複数）
  labResults?: LabResults; // 検査結果
  labTestLocation?: string; // 検体検査の院内/院外
  imageTestType?: string; // 画像検査の種別
  physiologicalTestType?: string; // 生理検査の種別
  imageUrl?: string;
  receivedAt: string; // 指示受け時刻
  acceptedAt?: string;
  implementedAt?: string;
  acceptedBy?: string;
  implementedBy?: string;
  implementationNotes?: string; // 実施概要
  scheduledTime?: string; // 予定時刻
  materialRecorded?: boolean; // 薬剤記録完了フラグ
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

// 使用機材・薬剤
export interface MaterialItem {
  id: string;
  type: '薬剤' | '機材';
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
  prescriptionType?: '院外' | '院内' | '麻薬';
  skipReason?: string;
  jobId?: string;
}