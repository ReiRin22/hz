"use client";
import { create } from "zustand";
import { registerStore } from "@/shared/stores/storeRegistry";
import type {
  PatientViewModel,
  PatientHeaderDialogState,
} from "@/shared/types/patient-header/patient-header.type";

type PatientHeaderStore = {
  // --- State ---
  patient: PatientViewModel | null;
  dialogs: PatientHeaderDialogState;
  isLoading: boolean;
  error: string | null;
  // --- Actions ---
  setPatient: (patient: PatientViewModel | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  openDialog: (key: keyof PatientHeaderDialogState) => void;
  closeDialog: (key: keyof PatientHeaderDialogState) => void;
  closeAllDialogs: () => void;
  reset: () => void;
};

const INITIAL_DIALOGS: PatientHeaderDialogState = {
  patientDetail: false,
  medicationHistory: false,
  testResults: false,
  imageViewer: false,
  diagnosisRegistration: false,
  patientSearch: false,
  prescriptionSettings: false,
  medicalInfoSharing: false,
  patientMemo: false,
  proxyInputConfirm: false,
};

const INITIAL_STATE = {
  patient: null,
  dialogs: INITIAL_DIALOGS,
  isLoading: false,
  error: null,
} satisfies Omit<
  PatientHeaderStore,
  | "setPatient"
  | "setIsLoading"
  | "setError"
  | "openDialog"
  | "closeDialog"
  | "closeAllDialogs"
  | "reset"
>;

export const usePatientHeaderStore = create<PatientHeaderStore>()((set) => ({
  ...INITIAL_STATE,
  setPatient: (patient) => set({ patient }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  openDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: true },
    })),
  closeDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: false },
    })),
  closeAllDialogs: () => set({ dialogs: { ...INITIAL_DIALOGS } }),
  reset: () => set({ ...INITIAL_STATE, dialogs: { ...INITIAL_DIALOGS } }),
}));

registerStore(() => usePatientHeaderStore.getState().reset());
