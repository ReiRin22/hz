export interface ImagingHistoryItemResponse {
  id: string;
  date: string;
  name: string;
  modality: string;
  bodyPart: string;
  imagingContent?: string;
  protocols?: string[];
  position?: string;
  laterality?: string;
  functionalConditions?: string[];
  specialInstructions?: string;
  bodyPartsList?: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
  priority?: string;
  preferredTime?: string;
  useContrast?: boolean;
  hasAllergy?: boolean;
  clinicalPurpose?: string;
  symptomTags?: string[];
}

export interface ImagingSetItemResponse {
  id: string;
  name: string;
  description: string;
  setType: 'hospital' | 'department' | 'my' | 'regular';
  items: ImagingHistoryItemResponse[];
}

export interface GetImagingHistoryResponse {
  history: ImagingHistoryItemResponse[];
}

export interface GetImagingSetsResponse {
  imagingSets: ImagingSetItemResponse[];
}

export interface ImagingOrderConfirmedResponse {
  id: string;
  name: string;
  modality: string;
  status: 'confirmed';
  confirmedAt: string;
  confirmedBy: string;
}

export interface ConfirmImagingOrdersResponse {
  confirmedOrders: ImagingOrderConfirmedResponse[];
}
