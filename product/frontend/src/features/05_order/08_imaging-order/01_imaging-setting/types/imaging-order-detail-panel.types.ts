/**
 * ImagingOrderDetailPanel - 型定義
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingOrderDetailPanel.types.ts
 */

import type { ImagingOrderItem } from './imaging-order-entry.type';

export interface ImagingOrderDetail {
  // 基本情報
  orderingDoctor: string;
  orderDateTime: string;

  // モダリティと部位（複数セット）
  modality: string;
  bodyPartsList: { bodyPart: string; protocol: string; laterality?: string; position?: string; radiationCondition?: string; }[];

  // 特別指示・機能条件
  specialInstructions?: string;
  functionalConditions?: string[];
  functionalConditionsText?: string;

  // 造影剤（CT/MRIのみ）
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  egfrValue?: string;

  // 妊娠確認（X-ray/CTのみ）
  pregnancyPossibility?: 'yes' | 'no' | 'unknown';
  lastMenstrualPeriod?: string;

  // 臨床目的
  clinicalPurpose: string;
  symptomTags: string[];

  // スケジューリング
  preferredTime: 'now' | 'morning' | 'afternoon' | 'specific' | 'unscheduled' | 'undated';
  scheduledDate?: string;
  scheduledTime?: string;

  // 優先度
  priority: 'normal' | 'urgent' | 'stat';

  // 技師へのメモ
  technicianNotes?: string;
}

export interface ImagingOrderDetailPanelProps {
  imagingItem: ImagingOrderItem;
  contentDetail: {
    examinationList: Array<{
      bodyPart: string;
      direction: string;
      laterality?: string;
      position?: string;
      radiationCondition?: string;
      functionalConditions?: string[];
    }>;
  };
  onConfirm: (detail: ImagingOrderDetail) => void;
  onCancel: () => void;
  onBack: () => void;
  onNavigateToScheduling?: (currentDetail: ImagingOrderDetail) => void;
  currentPatient: {
    name: string;
    id: string;
    age: number;
    gender: 'male' | 'female';
    patientNumber: string;
    visitDate: string;
  };
  initialScheduledDate?: string;
  initialScheduledTime?: string;
}
