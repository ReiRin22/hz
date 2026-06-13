'use client';

import { create } from 'zustand';
import { registerStore } from '@/shared/stores/storeRegistry';
import type { Order, OrderStatus } from '../types/deptInstruction.viewmodel';

// 楽観的更新のスナップショット（ロールバック用）
type OptimisticSnapshot = {
  orderId: string;
  previousStatus: OrderStatus;
};

interface DeptInstructionState {
  orders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;
  selectedOrderIds: string[];
  isLoading: boolean;
  // ダイアログ開閉状態
  isImplementerDialogOpen: boolean;
  isResultInputDialogOpen: boolean;
  isMaterialRecordDialogOpen: boolean;
  isPrintDialogOpen: boolean;
  isAllergyDialogOpen: boolean;
  printType: 'label' | 'document';
  // 楽観的更新キャッシュ
  optimisticSnapshot: OptimisticSnapshot | null;
}

interface DeptInstructionActions {
  setOrders: (orders: Order[]) => void;
  setFilteredOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  toggleOrderSelection: (orderId: string) => void;
  toggleAllOrders: (checked: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setMaterialRecorded: (orderId: string, recorded: boolean) => void;
  // ステータス更新（楽観的）
  optimisticUpdateStatus: (orderId: string, newStatus: OrderStatus, updatedBy: string) => void;
  rollbackStatus: () => void;
  confirmStatusUpdate: () => void;
  // ダイアログ制御
  openImplementerDialog: (order: Order) => void;
  closeImplementerDialog: () => void;
  openResultInputDialog: (order: Order) => void;
  closeResultInputDialog: () => void;
  openMaterialRecordDialog: (order: Order) => void;
  closeMaterialRecordDialog: () => void;
  openPrintDialog: (type: 'label' | 'document') => void;
  closePrintDialog: () => void;
  openAllergyDialog: (order: Order) => void;
  closeAllergyDialog: () => void;
  reset: () => void;
}

const initialState: DeptInstructionState = {
  orders: [],
  filteredOrders: [],
  selectedOrder: null,
  selectedOrderIds: [],
  isLoading: false,
  isImplementerDialogOpen: false,
  isResultInputDialogOpen: false,
  isMaterialRecordDialogOpen: false,
  isPrintDialogOpen: false,
  isAllergyDialogOpen: false,
  printType: 'label',
  optimisticSnapshot: null,
};

const TAIL_STATUSES: OrderStatus[] = ['result_entered'];

function sortToTail(orders: Order[]): Order[] {
  const head = orders.filter((o) => !TAIL_STATUSES.includes(o.status));
  const tail = orders.filter((o) => TAIL_STATUSES.includes(o.status));
  return [...head, ...tail];
}

function applyStatusToOrders(
  orders: Order[],
  orderId: string,
  newStatus: OrderStatus,
  updatedBy: string,
): Order[] {
  const timestamp = new Date().toLocaleString('ja-JP');
  const updated = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: newStatus,
          statusHistory: [
            ...(order.statusHistory ?? []),
            { status: newStatus, timestamp, updatedBy },
          ],
        }
      : order,
  );
  return TAIL_STATUSES.includes(newStatus) ? sortToTail(updated) : updated;
}

export const useDeptInstructionStore = create<DeptInstructionState & DeptInstructionActions>()(
  (set, get) => ({
    ...initialState,

    setOrders: (orders) => { const sorted = sortToTail(orders); set({ orders: sorted, filteredOrders: sorted }); },
    setFilteredOrders: (orders) => set({ filteredOrders: orders }),
    setSelectedOrder: (order) => set({ selectedOrder: order }),

    toggleOrderSelection: (orderId) =>
      set((state) => ({
        selectedOrderIds: state.selectedOrderIds.includes(orderId)
          ? state.selectedOrderIds.filter((id) => id !== orderId)
          : [...state.selectedOrderIds, orderId],
      })),

    toggleAllOrders: (checked) =>
      set((state) => ({
        selectedOrderIds: checked ? state.filteredOrders.map((o) => o.id) : [],
      })),

    setIsLoading: (value) => set({ isLoading: value }),

    setMaterialRecorded: (orderId, recorded) =>
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, materialRecorded: recorded } : o)),
        filteredOrders: state.filteredOrders.map((o) => (o.id === orderId ? { ...o, materialRecorded: recorded } : o)),
      })),

    optimisticUpdateStatus: (orderId, newStatus, updatedBy) => {
      const { orders } = get();
      const target = orders.find((o) => o.id === orderId);
      if (!target) return;
      set({
        optimisticSnapshot: { orderId, previousStatus: target.status },
        orders: applyStatusToOrders(orders, orderId, newStatus, updatedBy),
        filteredOrders: applyStatusToOrders(get().filteredOrders, orderId, newStatus, updatedBy),
      });
    },

    rollbackStatus: () => {
      const { optimisticSnapshot, orders, filteredOrders } = get();
      if (!optimisticSnapshot) return;
      const { orderId, previousStatus } = optimisticSnapshot;
      set({
        orders: orders.map((o) => (o.id === orderId ? { ...o, status: previousStatus } : o)),
        filteredOrders: filteredOrders.map((o) =>
          o.id === orderId ? { ...o, status: previousStatus } : o,
        ),
        optimisticSnapshot: null,
      });
    },

    confirmStatusUpdate: () => set({ optimisticSnapshot: null }),

    openImplementerDialog: (order) =>
      set({ selectedOrder: order, isImplementerDialogOpen: true }),
    closeImplementerDialog: () =>
      set({ isImplementerDialogOpen: false, selectedOrder: null }),

    openResultInputDialog: (order) =>
      set({ selectedOrder: order, isResultInputDialogOpen: true }),
    closeResultInputDialog: () =>
      set({ isResultInputDialogOpen: false, selectedOrder: null }),

    openMaterialRecordDialog: (order) =>
      set({ selectedOrder: order, isMaterialRecordDialogOpen: true }),
    closeMaterialRecordDialog: () =>
      set({ isMaterialRecordDialogOpen: false, selectedOrder: null }),

    openPrintDialog: (type) =>
      set({ isPrintDialogOpen: true, printType: type }),
    closePrintDialog: () => set({ isPrintDialogOpen: false }),

    openAllergyDialog: (order) =>
      set({ selectedOrder: order, isAllergyDialogOpen: true }),
    closeAllergyDialog: () =>
      set({ isAllergyDialogOpen: false, selectedOrder: null }),

    reset: () => set({ ...initialState }),
  }),
);

registerStore(() => useDeptInstructionStore.getState().reset());
