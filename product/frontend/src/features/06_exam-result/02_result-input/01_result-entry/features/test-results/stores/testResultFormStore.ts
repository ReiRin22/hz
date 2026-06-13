/**
 * 検査結果入力フォーム状態 Store（Page スコープ）
 * 設計書: docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/14.状態管理設計.md
 *
 * スコープ: Page（画面遷移で破棄、LocalStorage 非永続化）
 * 用途:
 *   - フォーム入力中の未保存データ退避
 *   - 選択行の管理
 *   - ダーティ状態の追跡（離脱確認ダイアログ用）
 */
import { create } from 'zustand';
import { TestResult } from '../../../lib/types';

interface TestResultFormState {
  /** 編集中の行 ID（null = 非編集状態） */
  editingRowId: string | null;
  /** 選択済み行 ID の集合 */
  selectedIds: Set<string>;
  /** 未保存の変更がある場合 true（離脱確認用） */
  isDirty: boolean;
  /** 修正理由ダイアログの開閉状態 */
  isReasonDialogOpen: boolean;
  /** 検査項目検索ダイアログの開閉状態 */
  isSearchDialogOpen: boolean;
  /** ローカルで編集中のフィールド差分（id -> 変更フィールド） */
  pendingUpdates: Record<string, Partial<TestResult>>;
}

interface TestResultFormActions {
  setEditingRowId: (id: string | null) => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setIsDirty: (dirty: boolean) => void;
  openReasonDialog: () => void;
  closeReasonDialog: () => void;
  openSearchDialog: () => void;
  closeSearchDialog: () => void;
  /** フィールド変更を pendingUpdates に積む */
  stagePendingUpdate: (id: string, field: keyof TestResult, value: TestResult[keyof TestResult]) => void;
  /** pendingUpdates をクリア（保存完了後） */
  clearPendingUpdates: () => void;
  /** Store をリセット（画面離脱時） */
  reset: () => void;
}

const initialState: TestResultFormState = {
  editingRowId: null,
  selectedIds: new Set(),
  isDirty: false,
  isReasonDialogOpen: false,
  isSearchDialogOpen: false,
  pendingUpdates: {},
};

export const useTestResultFormStore = create<TestResultFormState & TestResultFormActions>()((set) => ({
  ...initialState,

  setEditingRowId: (id) => set({ editingRowId: id }),

  toggleSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),

  clearSelection: () => set({ selectedIds: new Set() }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),

  openReasonDialog: () => set({ isReasonDialogOpen: true }),
  closeReasonDialog: () => set({ isReasonDialogOpen: false }),

  openSearchDialog: () => set({ isSearchDialogOpen: true }),
  closeSearchDialog: () => set({ isSearchDialogOpen: false }),

  stagePendingUpdate: (id, field, value) =>
    set((state) => ({
      isDirty: true,
      pendingUpdates: {
        ...state.pendingUpdates,
        [id]: { ...state.pendingUpdates[id], [field]: value },
      },
    })),

  clearPendingUpdates: () => set({ pendingUpdates: {}, isDirty: false }),

  reset: () => set({ ...initialState, selectedIds: new Set() }),
}));
