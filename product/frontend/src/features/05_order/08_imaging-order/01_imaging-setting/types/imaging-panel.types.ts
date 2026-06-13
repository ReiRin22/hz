/**
 * OrderPanel（画像検査用）関連の型定義
 */

import type { OrderDetail, SavedOrderData, EditingOrderData } from './order-shared.types';

export interface ImagingPanelProps {
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
}

export type { AllergyWarning, CategoryInfo, GroupedOrders, OrdersByType } from './order-shared.types';
