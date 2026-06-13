'use client';

import { create } from 'zustand';

interface RightSideMenuState {
  isCollapsed: boolean;
  showBulletinDialog: boolean;
  showMemoDialog: boolean;
  memoTab: 'received' | 'sent';
  selectedMemoId: string | null;
  isCreatingMemo: boolean;
  selectedDepartments: string[];
  confirmedMemos: Record<string, boolean>;

  toggleCollapse: () => void;
  openBulletinDialog: () => void;
  closeBulletinDialog: () => void;
  openMemoDialog: () => void;
  closeMemoDialog: () => void;
  setMemoTab: (tab: 'received' | 'sent') => void;
  selectMemo: (id: string) => void;
  clearSelectedMemo: () => void;
  startCreatingMemo: () => void;
  cancelCreatingMemo: () => void;
  toggleDepartment: (dept: string) => void;
  clearDepartments: () => void;
  confirmMemo: (id: string) => void;
  reset: () => void;
}

const initialState = {
  isCollapsed: false,
  showBulletinDialog: false,
  showMemoDialog: false,
  memoTab: 'received' as const,
  selectedMemoId: null,
  isCreatingMemo: false,
  selectedDepartments: [],
  confirmedMemos: {},
};

export const useRightSideMenuStore = create<RightSideMenuState>((set) => ({
  ...initialState,

  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),

  openBulletinDialog: () => set({ showBulletinDialog: true }),
  closeBulletinDialog: () => set({ showBulletinDialog: false }),

  openMemoDialog: () => set({ showMemoDialog: true }),
  closeMemoDialog: () =>
    set({ showMemoDialog: false, selectedMemoId: null, isCreatingMemo: false }),

  setMemoTab: (tab) => set({ memoTab: tab }),
  selectMemo: (id) => set({ selectedMemoId: id }),
  clearSelectedMemo: () => set({ selectedMemoId: null }),

  startCreatingMemo: () => set({ isCreatingMemo: true }),
  cancelCreatingMemo: () => set({ isCreatingMemo: false, selectedDepartments: [] }),

  toggleDepartment: (dept) =>
    set((s) => ({
      selectedDepartments: s.selectedDepartments.includes(dept)
        ? s.selectedDepartments.filter((d) => d !== dept)
        : [...s.selectedDepartments, dept],
    })),
  clearDepartments: () => set({ selectedDepartments: [] }),

  confirmMemo: (id) =>
    set((s) => ({
      confirmedMemos: { ...s.confirmedMemos, [id]: true },
      selectedMemoId: null,
    })),

  reset: () => set(initialState),
}));
