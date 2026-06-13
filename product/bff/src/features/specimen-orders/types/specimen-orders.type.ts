/** 上流 API（検体検査システム）から返却される生データ（BE は camelCase で返す） */

export interface UpstreamSpecimenItem {
  code: string;
  name: string;
  specimenType: string;
  category: string;
}

export interface UpstreamSpecimenHistoryItem {
  id: string;
  date: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  status: string;
  confirmedAt: string;
  confirmedBy: string;
  category?: string;
  quantity?: number;
  priority?: string;
  clinicalPurpose?: string;
  specialInstructions?: string;
}

export interface UpstreamSpecimenSet {
  id: string;
  name: string;
  description: string;
  setType: 'hospital' | 'department' | 'my' | 'regular';
  items: UpstreamSpecimenHistoryItem[];
}

export interface UpstreamConfirmedSpecimenOrder {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  status: string;
  confirmedAt: string;
  confirmedBy: string;
}
