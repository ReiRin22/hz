export interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
  allergies?: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  date?: string;
  source?: 'history' | 'set' | 'search' | 'frequent';
  type?: 'prescription' | 'injection' | 'lab';
  groupItems?: OrderItem[];
  groupId?: string;
  groupName?: string;
  groupType?: 'set' | 'history';
  itemCode?: string;
  subcategory?: string;
  subcategoryName?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
  notes?: string;
  priority?: string;
  rpNumber?: number;
  // RightPanel / DrugDetailPanel 拡張フィールド
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  specimenType?: string;
  collectionDate?: string;
  scheduledDates?: string[];
  contrastAgent?: string;
}

/** RightPanel の確定オーダー詳細（OrderItem の完全版） */
export type OrderDetail = OrderItem;

export interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderItem[];
  nextRpNumber: number;
}

export interface OrderSet {
  id: string;
  name: string;
  type: 'my-set' | 'composite-set';
  items: string[];
}

/** BFF から取得した過去処方履歴グループ（日付 + 科 + 主訴 + オーダー一覧） */
export interface OrderHistoryGroup {
  date: string;
  department: string;
  complaint: string;
  orders: OrderItem[];
}

export interface FrequentOrderItem extends OrderItem {
  frequency: string;
  lastUsed?: string;
}

export interface ScheduleDay {
  date: string;
  isScheduled: boolean;
}
