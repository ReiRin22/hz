/**
 * imaging-order 専用型定義
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/types/ImagingContentPanel.types.ts
 *         【ORD032～ORD035】src/components/features/imaging-order/types.ts
 */

// ---------------------------------------------------------------------------
// ImagingContentPanel 関連型
// ---------------------------------------------------------------------------

export interface ImagingOrderItem {
  id: string;
  name: string;
  type: 'imaging';
  category?: string;
  bodyPart?: string;
}

export interface ExaminationItem {
  bodyPart: string;
  direction: string;
  laterality?: string;
  radiationCondition?: string;
  position?: string;
  functionalConditions?: string[];
}

export interface ImagingContentDetail {
  examinationList: ExaminationItem[];
}

export interface ImagingContentPanelProps {
  imagingItem: ImagingOrderItem;
  onNext: (detail: ImagingContentDetail) => void;
  onCancel: () => void;
  onNavigateToReservation?: (detail: ImagingContentDetail, modality: string) => void;
  onNavigateToExamination?: (detail: ImagingContentDetail, modality: string) => void;
}

export interface ExaminationSection {
  id: string;
  bodyParts: string[];
  directions: string[];
  laterality: string[];
  radiationCondition: string;
  positions: string[];
  functionalConditions: string[];
  specialInstructions: string[];
  urgency: string;
}

// ---------------------------------------------------------------------------
// ImagingOrder 基本型
// ---------------------------------------------------------------------------

export type ImagingModality =
  | 'CT検査'
  | 'MRI検査'
  | 'X線撮影'
  | '超音波検査'
  | 'マンモグラフィ'
  | 'その他';

export type PreferredTimeSlot = '即時' | '午前' | '午後';

export type Priority = 'normal' | 'urgent' | 'routine';

export interface ImagingOrderData {
  id: string;
  modality?: ImagingModality;
  bodyPart?: string;
  imagingContent?: string;
  protocols?: string[];
  position?: string;
  laterality?: string;
  functionalConditions?: string[];
  specialInstructions?: string;
  radiationCondition?: string;
  measurementConditions?: string;
  priority?: Priority;
  preferredDate?: string;
  dateUndecided?: boolean;
  preferredTimeSlots?: PreferredTimeSlot[];
  scheduledDate?: string;
  scheduledTime?: string;
  preferredTime?: 'now' | 'morning' | 'afternoon' | 'specific' | 'unscheduled';
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  egfrValue?: string;
  clinicalPurpose?: string;
  symptomTags?: string[];
  technicianNotes?: string;
}

export interface BodyPartPreset {
  bodyPart: string;
  protocols: string[];
  laterality?: string;
  radiationCondition?: string;
}

export interface ImagingHistoryItem {
  id: string;
  date: string;
  modality: ImagingModality;
  bodyPart: string;
  protocol: string;
  useContrast: boolean;
}

export interface ImagingSetItem {
  id: string;
  name: string;
  modality: ImagingModality;
  items: BodyPartPreset[];
}
