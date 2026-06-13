export interface SpecimenOrderItem {
  specimenType: 'blood' | 'urine' | 'stool' | 'other';
  orderCode: string;
  testName: string;
  quantity?: number;
  priority?: 'normal' | 'urgent';
  clinicalPurpose?: string;
  specialInstructions?: string;
}

export interface ConfirmSpecimenOrdersRequest {
  items: SpecimenOrderItem[];
  // TODO: 認証実装後にセッションから取得
  confirmedBy: string;
}
