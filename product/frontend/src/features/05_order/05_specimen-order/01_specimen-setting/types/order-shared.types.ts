/**
 * 画像オーダー関連の共通型定義
 *
 * 参照元: 【ORD032～ORD035】src/types/order.ts
 *         【ORD032～ORD035】src/pages/_types/common.ts
 *         【ORD032～ORD035】src/components/features/order-entry/types/rightPanelTypes.ts
 */

// ---------------------------------------------------------------------------
// 基本列挙型
// ---------------------------------------------------------------------------

export type OrderType = 'prescription' | 'injection' | 'lab' | 'imaging';

export type OrderSource = 'history' | 'set' | 'search' | 'frequent';

export type GroupType = 'set' | 'history';

export type ImagingPriority = 'normal' | 'urgent' | 'stat';

export type PreferredTime = 'now' | 'morning' | 'afternoon' | 'specific' | 'unscheduled';

// ---------------------------------------------------------------------------
// 患者・ページ共通型
// ---------------------------------------------------------------------------

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
  type?: OrderType;
  source?: OrderSource;
  groupItems?: OrderItem[];
  groupId?: string;
  groupName?: string;
  groupType?: GroupType;
  itemCode?: string;
  category?: string;
  bodyPart?: string;
  modality?: string;
  protocol?: string;
  bodyPartsList?: {
    bodyPart: string;
    protocol: string;
    laterality?: string;
    radiationCondition?: string;
  }[];
  useContrast?: boolean;
  contrastAgent?: string;
  hasContrastAllergy?: boolean;
  eGFRValue?: string;
  lastMenstrualPeriod?: string;
  preferredTime?: string;
  priority?: string;
  notes?: string;
  scheduledDate?: string;
  specialInstructions?: string;
  functionalConditions?: string[];
  measurementConditions?: string;
  scheduledTime?: string;
}

// ---------------------------------------------------------------------------
// オーダー詳細型
// ---------------------------------------------------------------------------

export interface OrderDetail {
  id: string;
  name: string;
  type?: OrderType;
  notes?: string;

  // 共通フィールド
  dosage?: string;
  usage?: string;
  source?: OrderSource;
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;

  // 処方オーダー
  rpNumber?: number;

  // 注射オーダー
  scheduledDates?: string[];

  // 検体検査オーダー
  specimenType?: string;
  collectionDate?: string;
  contrastAgent?: string;
  itemCode?: string;
  subcategory?: string;
  subcategoryName?: string;

  // 画像検査オーダー
  category?: string;
  examType?: string;
  bodyPart?: string;
  modality?: string;
  imagingContent?: string;
  protocols?: string[];
  position?: string;
  laterality?: string;
  functionalConditions?: string[];
  specialInstructions?: string;
  radiationCondition?: string;
  measurementConditions?: string;
  preferredDate?: string;
  dateUndecided?: boolean;
  preferredTimeSlots?: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  preferredTime?: PreferredTime;
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  egfrValue?: string;
  clinicalPurpose?: string;
  symptomTags?: string[];
  technicianNotes?: string;
  bodyPartsList?: Array<{
    name: string;
    direction: string;
    position: string;
    imagingContent: string;
  }>;

  // グループ関連
  groupId?: string;
  groupName?: string;
  groupType?: GroupType;
}

// ---------------------------------------------------------------------------
// 保存・編集データ型
// ---------------------------------------------------------------------------

export interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderDetail[];
  nextRpNumber: number;
}

export interface EditingOrderData {
  modality?: string;
  bodyPart?: string;
  selectedBodyParts?: string[];
  imagingContent?: string;
  protocols?: string[];
  position?: string;
  laterality?: string;
  functionalConditions?: string[];
  specialInstructions?: string;
  radiationCondition?: string;
  measurementConditions?: string;
  priority?: string;
  preferredDate?: string;
  dateUndecided?: boolean;
  preferredTimeSlots?: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  preferredTime?: PreferredTime;
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  egfrValue?: string;
  clinicalPurpose?: string;
  symptomTags?: string[];
  technicianNotes?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
  notes?: string;
  bodyPartsList?: Array<{
    name: string;
    direction: string;
    position: string;
    imagingContent: string;
  }>;
}

// ---------------------------------------------------------------------------
// アレルギー・カテゴリ・グループ補助型
// ---------------------------------------------------------------------------

export interface AllergyWarning {
  order: OrderDetail;
  matchedAllergy: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
}

export interface GroupedOrders {
  grouped: { [key: string]: OrderDetail[] };
  ungrouped: OrderDetail[];
}

export interface OrdersByType {
  prescription: OrderDetail[];
  injection: OrderDetail[];
  lab: OrderDetail[];
  imaging: OrderDetail[];
}

// ---------------------------------------------------------------------------
// 帳票・画像検査中間データ型
// ---------------------------------------------------------------------------

export interface ReportSelection {
  imaging: boolean;
  imagingConsent: boolean;
  imagingExplanation: boolean;
}

export interface ImagingContentDetail {
  examinationList: Array<{ bodyPart: string; direction: string; laterality?: string }>;
}

export interface ImagingInstructionsDetail {
  specialInstructions: string;
  measurementConditions: string;
}

export interface ImagingReservationData {
  modality: string;
  bodyPartsList: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
}
