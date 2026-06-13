import type { OrderType, OrderStatus } from "@/front_bff_shared/features/orders/_shared/types/order.type";

/** 検体サブアイテムの表示用型 */
export interface SpecimenSubItemViewModel {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  priority?: string;
}

/** 未確定オーダー行の表示用型 */
export interface PendingOrderViewModel {
  id: string;
  type: OrderType;
  typeName: string;
  detail: string;
  addedAt: string;
  specimenSubItems?: SpecimenSubItemViewModel[];
  scheduledAt?: string;
}

/** 確定済みオーダー行の表示用型 */
export interface ConfirmedOrderViewModel {
  id: string;
  type: OrderType;
  typeName: string;
  detail: string;
  confirmedAt: string;
  status: OrderStatus;
  isRevoked: boolean;
  specimenSubItems?: SpecimenSubItemViewModel[];
  scheduledAt?: string;
  /** DEP002で更新された部門指示受けステータス */
  deptInstructionStatus?: string;
}

/** 帳票一覧の表示用型 */
export interface FormViewModel {
  id: string;
  name: string;
  description: string;
  relatedOrderIds: string[];
}

/** オーダー種別の表示用型 */
export interface OrderTypeViewModel {
  id: string;
  name: string;
  route: string;
}

/** ダイアログ表示状態 */
export interface OrderConfirmDialogState {
  isPrintDialogOpen: boolean;
  isOrderTypeDialogOpen: boolean;
  isEditConfirmDialogOpen: boolean;
  isRevokeConfirmDialogOpen: boolean;
  isReprintConfirmDialogOpen: boolean;
}
