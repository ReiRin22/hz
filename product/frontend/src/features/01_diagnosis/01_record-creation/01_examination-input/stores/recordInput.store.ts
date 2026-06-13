import { create } from 'zustand';
import { registerStore } from '@/shared/stores/storeRegistry';

type RecordInputMode = 'new' | 'edit';

type RecordInputStore = {
  // --- State ---
  mode: RecordInputMode;
  recordDate: string;
  authorName: string;
  soapText: string;
  hasDraft: boolean;
  isEditable: boolean;
  confirmButtonDisabled: boolean;
  isVoiceActive: boolean;
  // --- Actions ---
  setMode: (mode: RecordInputMode) => void;
  setRecordDate: (date: string) => void;
  setAuthorName: (name: string) => void;
  setSoapText: (text: string) => void;
  setHasDraft: (has: boolean) => void;
  setIsEditable: (editable: boolean) => void;
  setConfirmButtonDisabled: (disabled: boolean) => void;
  setIsVoiceActive: (active: boolean) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const INITIAL_RECORD_INPUT_STATE = {
  mode: 'new' as RecordInputMode,
  recordDate: todayIso(),
  authorName: '',
  soapText: '',
  hasDraft: false,
  isEditable: true,
  confirmButtonDisabled: false,
  isVoiceActive: false,
} satisfies Omit<
  RecordInputStore,
  | 'setMode'
  | 'setRecordDate'
  | 'setAuthorName'
  | 'setSoapText'
  | 'setHasDraft'
  | 'setIsEditable'
  | 'setConfirmButtonDisabled'
  | 'setIsVoiceActive'
  | 'reset'
>;

export const useRecordInputStore = create<RecordInputStore>()((set) => ({
  ...INITIAL_RECORD_INPUT_STATE,
  setMode: (mode) => set({ mode }),
  setRecordDate: (date) => set({ recordDate: date }),
  setAuthorName: (name) => set({ authorName: name }),
  setSoapText: (text) => set({ soapText: text }),
  setHasDraft: (has) => set({ hasDraft: has }),
  setIsEditable: (editable) => set({ isEditable: editable }),
  setConfirmButtonDisabled: (disabled) => set({ confirmButtonDisabled: disabled }),
  setIsVoiceActive: (active) => set({ isVoiceActive: active }),
  reset: () => set({ ...INITIAL_RECORD_INPUT_STATE, recordDate: todayIso() }),
}));

registerStore(() => useRecordInputStore.getState().reset());
