import { create } from 'zustand';
import { registerStore } from '@/shared/stores/storeRegistry';
import type {
  DrawTool,
  DrawOperation,
  SchemaCreationMode,
  FabricCanvasSnapshot,
} from '../types/schema-creation.types';

const UNDO_REDO_MAX = 50;

type SchemaCreationStore = {
  // --- State ---
  mode: SchemaCreationMode;
  activeTool: DrawTool;
  strokeColor: string;
  penSize: number;
  undoStack: FabricCanvasSnapshot[];
  redoStack: FabricCanvasSnapshot[];
  hasDrawContent: boolean;
  selectedBodyPart: string;
  isSubmitting: boolean;
  favoriteTemplateIds: string[];
  // --- Actions ---
  setMode: (mode: SchemaCreationMode) => void;
  setActiveTool: (tool: DrawTool) => void;
  setStrokeColor: (color: string) => void;
  setPenSize: (size: number) => void;
  /** 操作をundoStackに積む。最大50件を超えた場合は先頭を破棄し、redoStackをクリア */
  pushUndo: (snapshot: FabricCanvasSnapshot) => void;
  /** undoStack末尾を取り出してredoStackに積む */
  popUndo: () => FabricCanvasSnapshot | undefined;
  /** redoStack末尾を取り出してundoStackに積む */
  popRedo: () => FabricCanvasSnapshot | undefined;
  /** 新規描画時にredoStackをクリア */
  clearRedo: () => void;
  /** テンプレート適用・画像インポート時に履歴をリセットし初期状態を保存 */
  resetHistoryStack: (initialSnapshot: FabricCanvasSnapshot) => void;
  setHasDrawContent: (has: boolean) => void;
  setSelectedBodyPart: (part: string) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setFavoriteTemplateIds: (ids: string[]) => void;
  /** お気に入りトグル: 登録済みなら解除、未登録なら追加 */
  toggleFavoriteId: (templateId: string) => void;
  reset: () => void;
};

const INITIAL_SCHEMA_CREATION_STATE = {
  mode: 'new' as SchemaCreationMode,
  activeTool: 'pen' as DrawTool,
  strokeColor: '#000000',
  penSize: 2,
  undoStack: [] as FabricCanvasSnapshot[],
  redoStack: [] as FabricCanvasSnapshot[],
  hasDrawContent: false,
  selectedBodyPart: '全身図',
  isSubmitting: false,
  favoriteTemplateIds: [] as string[],
} satisfies Omit<
  SchemaCreationStore,
  | 'setMode'
  | 'setActiveTool'
  | 'setStrokeColor'
  | 'setPenSize'
  | 'pushUndo'
  | 'popUndo'
  | 'popRedo'
  | 'clearRedo'
  | 'setHasDrawContent'
  | 'setSelectedBodyPart'
  | 'setIsSubmitting'
  | 'setFavoriteTemplateIds'
  | 'toggleFavoriteId'
  | 'resetHistoryStack'
  | 'reset'
>;

export const useSchemaCreationStore = create<SchemaCreationStore>()((set, get) => ({
  ...INITIAL_SCHEMA_CREATION_STATE,

  setMode: (mode) => set({ mode }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setPenSize: (size) => set({ penSize: size }),

  pushUndo: (snapshot) =>
    set((state) => {
      const next = [...state.undoStack, snapshot];
      return {
        undoStack: next.length > UNDO_REDO_MAX ? next.slice(1) : next,
        redoStack: [],
      };
    }),

  popUndo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return undefined;
    const snapshot = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, snapshot].slice(-UNDO_REDO_MAX),
    });
    return snapshot;
  },

  popRedo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return undefined;
    const snapshot = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, snapshot].slice(-UNDO_REDO_MAX),
    });
    return snapshot;
  },

  clearRedo: () => set({ redoStack: [] }),

  resetHistoryStack: (initialSnapshot) => set({ undoStack: [initialSnapshot], redoStack: [] }),

  setHasDrawContent: (has) => set({ hasDrawContent: has }),
  setSelectedBodyPart: (part) => set({ selectedBodyPart: part }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setFavoriteTemplateIds: (ids) => set({ favoriteTemplateIds: ids }),

  toggleFavoriteId: (templateId) =>
    set((state) => ({
      favoriteTemplateIds: state.favoriteTemplateIds.includes(templateId)
        ? state.favoriteTemplateIds.filter((id) => id !== templateId)
        : [...state.favoriteTemplateIds, templateId],
    })),

  reset: () => set(INITIAL_SCHEMA_CREATION_STATE),
}));

registerStore(() => useSchemaCreationStore.getState().reset());
