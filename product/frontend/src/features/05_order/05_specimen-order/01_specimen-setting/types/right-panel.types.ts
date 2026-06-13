/**
 * RightPanel関連の型定義
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/types/rightPanelTypes.ts
 */

import type { OrderDetail, SavedOrderData, EditingOrderData } from './order-shared.types';
import type { SpecimenSetItem, SpecimenHistoryItem, SpecimenOrderFormItem } from '@/features/05_order/05_specimen-order/01_specimen-setting/types/specimen-order-entry.type';
import type { SpecimenSetType } from '@/features/05_order/05_specimen-order/01_specimen-setting/hooks/useSpecimenPanelData';

export interface RightPanelProps {
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onAddOrder?: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onConfirmAllOrders: () => void;
  activeOrderType: string;
  isLabDirectMode?: boolean;
  savedOrderDataList: SavedOrderData[];
  onSaveTemporary: (saveName: string) => void;
  onLoadTemporary: (saveData: SavedOrderData) => void;
  onDeleteSavedData: (saveId: string) => void;
  onNavigateToExamination?: (orderId: string) => void;
  patientAllergies?: string[];
  onRemoveGroup?: (groupId: string) => void;
  isTwoColumnMode?: boolean;
  onEditImagingOrder?: (order: OrderDetail) => void;
  onDuplicateOrder?: (order: OrderDetail) => void;
  onAddNewOrder?: () => void;
  onCloseImagingInput?: () => void;
  onCloseLabInput?: () => void;
  activeSubTab?: 'search' | 'history' | 'sets';
  onSubTabChange?: (tab: 'search' | 'history' | 'sets') => void;
  showImagingOrderPanel?: boolean;
  onShowImagingOrderPanelChange?: (show: boolean) => void;
  editingOrders?: Record<string, EditingOrderData>;
  onEditingOrdersChange?: (editingOrders: Record<string, EditingOrderData>) => void;
  /** 画像検査履歴・セット取得に使用する患者ID */
  patientId?: string;
  /** 検体検査用データ（activeOrderType === 'lab' のとき使用） */
  specimenSets?: SpecimenSetItem[];
  specimenHistory?: SpecimenHistoryItem[];
  selectedSpecimenSetType?: SpecimenSetType;
  onSpecimenSetTypeChange?: (type: SpecimenSetType) => void;
  isSpecimenLoading?: boolean;
  specimenError?: string | null;
  onAddSpecimenItem?: (item: Omit<SpecimenOrderFormItem, 'id'>) => string | undefined;
  onAddSpecimenItems?: (items: Omit<SpecimenOrderFormItem, 'id'>[]) => void;
  showSpecimenEditForm?: boolean;
  onShowSpecimenEditFormChange?: (show: boolean) => void;
  /** オーダー確定画面に追加済みの検査コード（検体検査選択パネルでのグレーアウト用） */
  confirmedSpecimenOrderCodes?: string[];
  /** 検体検査グループの実施予定日を更新するコールバック */
  onUpdateSpecimenGroupDate?: (groupId: string, date: string | undefined) => void;
}

export type { SpecimenSetItem, SpecimenHistoryItem, SpecimenOrderFormItem, SpecimenSetType };

export type { AllergyWarning, CategoryInfo, GroupedOrders, OrdersByType } from './order-shared.types';
