/**
 * ImagingExaminationScheduling - 型定義
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingExaminationScheduling.types.ts
 */

import type { ImagingOrderItem } from './imaging-order-entry.type';

export interface ExaminationSlot {
  time: string;
  available: boolean;
  examType?: string;
}

export interface ImagingExaminationSchedulingProps {
  imagingItem: ImagingOrderItem;
  onDateTimeSelected: (date: string, time: string) => void;
  onBack: () => void;
  onCancel: () => void;
}
