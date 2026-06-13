export interface SpecimenHistoryItemResponse {
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

export interface GetSpecimenHistoryResponse {
  history: SpecimenHistoryItemResponse[];
}

export interface SpecimenSetItemResponse {
  id: string;
  name: string;
  description: string;
  setType: 'hospital' | 'department' | 'my' | 'regular';
  items: SpecimenHistoryItemResponse[];
}

export interface GetSpecimenSetsResponse {
  specimenSets: SpecimenSetItemResponse[];
}

export interface SpecimenOrderConfirmedResponse {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  status: 'confirmed';
  confirmedAt: string;
  confirmedBy: string;
}

export interface ConfirmSpecimenOrdersResponse {
  confirmedOrders: SpecimenOrderConfirmedResponse[];
}

export interface SpecimenItemResponse {
  code: string;
  name: string;
  specimenType: string;
  category: string;
}

export interface GetSpecimenItemsResponse {
  items: SpecimenItemResponse[];
}
