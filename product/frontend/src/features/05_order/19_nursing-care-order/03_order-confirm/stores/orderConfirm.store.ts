'use client';

import { create } from 'zustand';
import type { PendingOrderViewModel, ConfirmedOrderViewModel, FormViewModel, OrderTypeViewModel } from '../types/order-confirm.types';

interface OrderConfirmState {
  pendingOrders: PendingOrderViewModel[];
  confirmedOrders: ConfirmedOrderViewModel[];
  orderTypes: OrderTypeViewModel[];
  isPrintDialogOpen: boolean;
  isOrderTypeDialogOpen: boolean;
  isEditConfirmDialogOpen: boolean;
  isRevokeConfirmDialogOpen: boolean;
  isReprintConfirmDialogOpen: boolean;
  targetOrderId: string | null;
  allForms: FormViewModel[];
  selectedForms: FormViewModel[];
  isConfirming: boolean;
  isLoadingOrders: boolean;
}

interface OrderConfirmActions {
  setPendingOrders: (orders: PendingOrderViewModel[]) => void;
  addPendingOrders: (orders: PendingOrderViewModel[]) => void;
  setConfirmedOrders: (orders: ConfirmedOrderViewModel[]) => void;
  setOrderTypes: (types: OrderTypeViewModel[]) => void;
  removePendingOrder: (orderId: string) => void;
  moveOrdersToConfirmed: (newlyConfirmed: ConfirmedOrderViewModel[]) => void;
  updateDeptInstructionStatus: (orderId: string, status: string) => void;
  openPrintDialog: () => void;
  closePrintDialog: () => void;
  openOrderTypeDialog: () => void;
  closeOrderTypeDialog: () => void;
  openEditConfirmDialog: (orderId: string) => void;
  closeEditConfirmDialog: () => void;
  openRevokeConfirmDialog: (orderId: string) => void;
  closeRevokeConfirmDialog: () => void;
  openReprintConfirmDialog: () => void;
  closeReprintConfirmDialog: () => void;
  setAllForms: (forms: FormViewModel[]) => void;
  selectAllForms: () => void;
  toggleFormSelection: (formId: string) => void;
  setIsConfirming: (value: boolean) => void;
  setIsLoadingOrders: (value: boolean) => void;
  reset: () => void;
}

const initialState: OrderConfirmState = {
  pendingOrders: [],
  confirmedOrders: [],
  orderTypes: [],
  isPrintDialogOpen: false,
  isOrderTypeDialogOpen: false,
  isEditConfirmDialogOpen: false,
  isRevokeConfirmDialogOpen: false,
  isReprintConfirmDialogOpen: false,
  targetOrderId: null,
  allForms: [],
  selectedForms: [],
  isConfirming: false,
  isLoadingOrders: false,
};

export const useOrderConfirmStore = create<OrderConfirmState & OrderConfirmActions>()((set) => ({
  ...initialState,

  setPendingOrders: (orders) => set({ pendingOrders: orders }),

  addPendingOrders: (orders) =>
    set((state) => ({ pendingOrders: [...orders, ...state.pendingOrders] })),

  setConfirmedOrders: (orders) => set({ confirmedOrders: orders }),

  setOrderTypes: (types) => set({ orderTypes: types }),

  removePendingOrder: (orderId) =>
    set((state) => ({
      pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
    })),

  updateDeptInstructionStatus: (orderId, status) =>
    set((state) => ({
      confirmedOrders: state.confirmedOrders.map((o) =>
        o.id === orderId ? { ...o, deptInstructionStatus: status } : o
      ),
    })),

  moveOrdersToConfirmed: (newlyConfirmed) =>
    set((state) => {
      const confirmedIds = new Set(newlyConfirmed.map((o) => o.id));
      return {
        pendingOrders: state.pendingOrders.filter((o) => !confirmedIds.has(o.id)),
        confirmedOrders: [...newlyConfirmed, ...state.confirmedOrders],
      };
    }),

  openPrintDialog: () => set({ isPrintDialogOpen: true }),
  closePrintDialog: () => set({ isPrintDialogOpen: false }),

  openOrderTypeDialog: () => set({ isOrderTypeDialogOpen: true }),
  closeOrderTypeDialog: () => set({ isOrderTypeDialogOpen: false }),

  openEditConfirmDialog: (orderId) =>
    set({ isEditConfirmDialogOpen: true, targetOrderId: orderId }),
  closeEditConfirmDialog: () =>
    set({ isEditConfirmDialogOpen: false, targetOrderId: null }),

  openRevokeConfirmDialog: (orderId) =>
    set({ isRevokeConfirmDialogOpen: true, targetOrderId: orderId }),
  closeRevokeConfirmDialog: () =>
    set({ isRevokeConfirmDialogOpen: false, targetOrderId: null }),

  openReprintConfirmDialog: () => set({ isReprintConfirmDialogOpen: true }),
  closeReprintConfirmDialog: () => set({ isReprintConfirmDialogOpen: false }),

  setAllForms: (forms) => set({ allForms: forms, selectedForms: [] }),

  selectAllForms: () =>
    set((state) => ({ selectedForms: [...state.allForms] })),

  toggleFormSelection: (formId) =>
    set((state) => {
      const isSelected = state.selectedForms.some((f) => f.id === formId);
      if (isSelected) {
        return { selectedForms: state.selectedForms.filter((f) => f.id !== formId) };
      }
      const form = state.allForms.find((f) => f.id === formId);
      if (!form) return {};
      return { selectedForms: [...state.selectedForms, form] };
    }),

  setIsConfirming: (value) => set({ isConfirming: value }),

  setIsLoadingOrders: (value) => set({ isLoadingOrders: value }),

  reset: () => set({ ...initialState }),
}));
