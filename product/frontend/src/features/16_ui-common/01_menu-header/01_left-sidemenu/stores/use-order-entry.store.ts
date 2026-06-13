import { create } from 'zustand';
import { registerStore } from '@/shared/stores/storeRegistry';
import type { OrderItem, SavedOrderData, OrderHistoryGroup, OrderSet } from '../types/order.types';

type OrderEntryStore = {
  activeTab: string;
  candidates: OrderItem[];
  confirmedOrders: OrderItem[];
  savedOrderDataList: SavedOrderData[];
  nextRpNumber: number;
  orderHistoryByTab: Record<string, OrderHistoryGroup[]>;
  orderSetsByTab: Record<string, OrderSet[]>;
  setActiveTab: (tab: string) => void;
  switchTab: (tab: string) => void;
  addCandidate: (item: OrderItem) => void;
  addMultipleCandidates: (items: OrderItem[]) => void;
  removeCandidate: (id: string) => void;
  clearCandidates: () => void;
  addConfirmedOrder: (order: OrderItem) => void;
  addMultipleConfirmedOrders: (orders: OrderItem[]) => void;
  updateConfirmedOrder: (order: OrderItem) => void;
  removeConfirmedOrder: (id: string) => void;
  removeConfirmedOrdersByGroupId: (groupId: string) => void;
  clearConfirmedOrders: () => void;
  setConfirmedOrders: (orders: OrderItem[]) => void;
  addSavedOrderData: (data: SavedOrderData) => void;
  removeSavedOrderData: (id: string) => void;
  incrementRpNumber: () => void;
  resetRpNumber: () => void;
  setNextRpNumber: (n: number) => void;
  setOrderHistoryByTab: (history: Record<string, OrderHistoryGroup[]>) => void;
  setOrderSetsByTab: (sets: Record<string, OrderSet[]>) => void;
  reset: () => void;
};

const INITIAL_ORDER_ENTRY_STATE = {
  activeTab: 'prescription',
  candidates: [] as OrderItem[],
  confirmedOrders: [] as OrderItem[],
  savedOrderDataList: [] as SavedOrderData[],
  nextRpNumber: 1,
  orderHistoryByTab: {} as Record<string, OrderHistoryGroup[]>,
  orderSetsByTab: {} as Record<string, OrderSet[]>,
} satisfies Omit<
  OrderEntryStore,
  | 'setActiveTab'
  | 'switchTab'
  | 'addCandidate'
  | 'addMultipleCandidates'
  | 'removeCandidate'
  | 'clearCandidates'
  | 'addConfirmedOrder'
  | 'addMultipleConfirmedOrders'
  | 'updateConfirmedOrder'
  | 'removeConfirmedOrder'
  | 'removeConfirmedOrdersByGroupId'
  | 'clearConfirmedOrders'
  | 'setConfirmedOrders'
  | 'addSavedOrderData'
  | 'removeSavedOrderData'
  | 'incrementRpNumber'
  | 'resetRpNumber'
  | 'setNextRpNumber'
  | 'setOrderHistoryByTab'
  | 'setOrderSetsByTab'
  | 'reset'
>;

export const useOrderEntryStore = create<OrderEntryStore>()((set) => ({
  ...INITIAL_ORDER_ENTRY_STATE,
  setActiveTab: (tab) => set({ activeTab: tab }),
  // T6-1: 種別切り替え時にCenterPanelの候補もクリア
  switchTab: (tab) => set({ activeTab: tab, candidates: [] }),
  addCandidate: (item) => set((s) => ({ candidates: [...s.candidates, item] })),
  addMultipleCandidates: (items) => set((s) => ({ candidates: [...s.candidates, ...items] })),
  removeCandidate: (id) => set((s) => ({ candidates: s.candidates.filter((c) => c.id !== id) })),
  clearCandidates: () => set({ candidates: [] }),
  addConfirmedOrder: (order) => set((s) => ({ confirmedOrders: [...s.confirmedOrders, order] })),
  addMultipleConfirmedOrders: (orders) =>
    set((s) => ({ confirmedOrders: [...s.confirmedOrders, ...orders] })),
  updateConfirmedOrder: (order) =>
    set((s) => ({
      confirmedOrders: s.confirmedOrders.map((o) => (o.id === order.id ? order : o)),
    })),
  removeConfirmedOrder: (id) =>
    set((s) => ({ confirmedOrders: s.confirmedOrders.filter((o) => o.id !== id) })),
  removeConfirmedOrdersByGroupId: (groupId) =>
    set((s) => ({ confirmedOrders: s.confirmedOrders.filter((o) => o.groupId !== groupId) })),
  clearConfirmedOrders: () => set({ confirmedOrders: [] }),
  setConfirmedOrders: (orders) => set({ confirmedOrders: orders }),
  addSavedOrderData: (data) =>
    set((s) => ({ savedOrderDataList: [...s.savedOrderDataList, data] })),
  removeSavedOrderData: (id) =>
    set((s) => ({ savedOrderDataList: s.savedOrderDataList.filter((d) => d.id !== id) })),
  incrementRpNumber: () => set((s) => ({ nextRpNumber: s.nextRpNumber + 1 })),
  resetRpNumber: () => set({ nextRpNumber: 1 }),
  setNextRpNumber: (n) => set({ nextRpNumber: n }),
  setOrderHistoryByTab: (history) => set({ orderHistoryByTab: history }),
  setOrderSetsByTab: (sets) => set({ orderSetsByTab: sets }),
  reset: () => set(INITIAL_ORDER_ENTRY_STATE),
}));

registerStore(() => useOrderEntryStore.getState().reset());
