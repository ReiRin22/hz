export interface ImagingOrderInput {
  name: string;
  modality: string;
  bodyPart: string;
  scheduledDate: string;
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  protocols?: string[];
  bodyPartsList?: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
  priority?: string;
  preferredTime?: string;
  clinicalPurpose?: string;
  specialInstructions?: string;
}

export interface ConfirmImagingOrdersRequest {
  orders: ImagingOrderInput[];
  // TODO: 認証実装後にセッションから取得
  confirmedBy: string;
}
