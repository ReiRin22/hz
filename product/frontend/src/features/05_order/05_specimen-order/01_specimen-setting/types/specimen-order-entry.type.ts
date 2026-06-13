/** 検体検査オーダー入力 専用型定義 */

export type SpecimenType = 'blood' | 'urine' | 'stool' | 'other';

export type OrderPriority = 'normal' | 'urgent';

export interface SpecimenOrderFormItem {
  id: string;
  specimenType: SpecimenType;
  orderCode: string;
  testName: string;
  category?: string;
  quantity?: number;
  priority?: OrderPriority;
  clinicalPurpose?: string;
  specialInstructions?: string;
  /** 検査実施予定日 (YYYY-MM-DD) */
  scheduledDate?: string;
}

export interface SpecimenSetItem {
  id: string;
  name: string;
  description: string;
  setType: 'hospital' | 'department' | 'my' | 'regular';
  items: SpecimenOrderFormItem[];
}

export interface SpecimenHistoryItem {
  id: string;
  date: string;
  testName: string;
  orderCode: string;
  specimenType: SpecimenType;
  status: string;
  confirmedAt: string;
  confirmedBy: string;
  category?: string;
  quantity?: number;
  priority?: OrderPriority;
  clinicalPurpose?: string;
  specialInstructions?: string;
}

export interface ConfirmedSpecimenOrder {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: SpecimenType;
  status: 'confirmed';
  confirmedAt: string;
  confirmedBy: string;
}

export type SpecimenSubTab = 'search' | 'history' | 'sets';
