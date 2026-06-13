// オーダー関連の型定義

export interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent' | 'category';
  groupItems?: OrderItem[]; // グループの場合の子項目
}

export interface OrderDetail extends OrderItem {
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  specimenType?: string;
  collectionDate?: string;
  notes?: string;
  rpNumber?: number;
  quantity?: string;
  frequency?: string;
  timing?: string;
  infusionRate?: string; // 注射用: 投与速度
}

export interface FrequentOrderItem extends OrderItem {
  frequency: number; // 使用頻度（今月の使用回数）
}

export interface OrderCategory {
  id: string;
  name: string;
  items: OrderItem[];
}

export interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderDetail[];
  nextRpNumber: number;
}

// 注射スケジュール用の型
export interface ScheduleDay {
  date: string;        // ISO形式の日付 (YYYY-MM-DD)
  displayDate: string; // 表示用の日付 (M/D)
  dayOfWeek: string;   // 曜日 (日、月、火...)
  isWeekend: boolean;  // 週末かどうか
}

// 注射履歴の型
export interface InjectionHistory {
  id: string;
  date: string;
  orders: OrderItem[];
}

// 注射セットの型
export interface OrderSet {
  id: string;
  name: string;
  items: OrderItem[];
}