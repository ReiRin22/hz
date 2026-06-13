/** 上流 API（画像検査システム）から返却される生データ */

export interface UpstreamImagingHistoryItem {
  examId: string;
  examDate: string;
  examName: string;
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
  hasContrastAllergy?: boolean;
  clinicalPurpose?: string;
  symptomTags?: string[];
}

export interface UpstreamImagingSet {
  setId: string;
  setName: string;
  setDescription: string;
  setType: 'hospital' | 'department' | 'my' | 'regular';
  examItems: UpstreamImagingHistoryItem[];
}

export interface UpstreamConfirmedImagingOrder {
  orderId: string;
  orderName: string;
  modality: string;
  orderStatus: string;
  confirmedAt: string;
  confirmedBy: string;
}
