'use client';

import { create } from 'zustand';
import { ja } from '@/shared/i18n/ja';
import type {
  ConfirmerType,
  Expectations,
} from '../types/patientIdCheck.viewmodel';

interface CheckedDerived {
  isPatientChecked: boolean;
  isItemChecked: boolean;
  isPractitionerChecked: boolean;
  isAllChecked: boolean;
}

interface PatientIdCheckData {
  orderId: string | null;
  expectations: Expectations | null;
  patientScanned: { value: string; matchResult: 'OK' | 'NG' | null } | null;
  itemScanned: { value: string; matchResult: 'OK' | 'NG' | null } | null;
  practitionerScanned: { value: string; staffName: string | null } | null;
  patientVisualConfirmed: boolean;
  patientConfirmer: ConfirmerType;
  presetReasonCode: string;
  customReason: string;
  itemVisualChecked: boolean;
  manualPractitionerId: string;
  idValidationError: string | null;
  unconfirmedAlert: string | null;
}

interface PatientIdCheckActions extends CheckedDerived {
  setOrderId(id: string): void;
  setExpectations(exp: Expectations): void;
  applyBarcodeRead(value: string): void;
  setPractitionerStaffName(staffName: string | null): void;
  setPatientVisualConfirmed(checked: boolean): void;
  setPatientConfirmer(type: ConfirmerType): void;
  setPresetReason(code: string): void;
  setCustomReason(text: string): void;
  setItemVisualChecked(checked: boolean): void;
  setManualPractitionerId(id: string): void;
  registerManualPractitionerId(): boolean;
  setIdValidationError(error: string | null): void;
  reset(): void;
}

export type PatientIdCheckState = PatientIdCheckData & PatientIdCheckActions;

function deriveChecked(data: PatientIdCheckData): CheckedDerived & { unconfirmedAlert: string | null } {
  const isPatientChecked =
    data.patientScanned?.matchResult === 'OK' || data.patientVisualConfirmed;
  const isItemChecked =
    data.itemScanned?.matchResult === 'OK' || data.itemVisualChecked;
  const isPractitionerChecked =
    data.practitionerScanned?.staffName != null ||
    data.manualPractitionerId.length > 0;
  const isAllChecked = isPatientChecked && isItemChecked && isPractitionerChecked;
  return {
    isPatientChecked,
    isItemChecked,
    isPractitionerChecked,
    isAllChecked,
    unconfirmedAlert: isAllChecked
      ? null
      : ja.deptInstruction.patientIdCheck.organism.unconfirmedAlert,
  };
}

const INITIAL_DATA: PatientIdCheckData = {
  orderId: null,
  expectations: null,
  patientScanned: null,
  itemScanned: null,
  practitionerScanned: null,
  patientVisualConfirmed: false,
  patientConfirmer: 'PERSON',
  presetReasonCode: '',
  customReason: '',
  itemVisualChecked: false,
  manualPractitionerId: '',
  idValidationError: null,
  unconfirmedAlert: null,
};

const INITIAL_STATE: PatientIdCheckData & CheckedDerived = {
  ...INITIAL_DATA,
  isPatientChecked: false,
  isItemChecked: false,
  isPractitionerChecked: false,
  isAllChecked: false,
};

export const usePatientIdCheckStore = create<PatientIdCheckState>()((set, get) => ({
  ...INITIAL_STATE,

  setOrderId: (id) => set({ orderId: id }),

  setExpectations: (exp) => set({ expectations: exp }),

  applyBarcodeRead: (value) => {
    const state = get();
    const { expectations } = state;
    if (!expectations) return;

    let next: Partial<PatientIdCheckData> = {};

    if (state.patientScanned == null) {
      const matchResult = value === expectations.patient.barcode ? 'OK' : 'NG';
      next.patientScanned = { value, matchResult };
    } else if (state.itemScanned == null) {
      const matchResult = value === expectations.item.barcode ? 'OK' : 'NG';
      next.itemScanned = { value, matchResult };
    } else {
      // 実施者セクション（staffName は setPractitionerStaffName で後から注入）
      next.practitionerScanned = { value, staffName: null };
    }

    const merged: PatientIdCheckData = { ...state, ...next };
    set({ ...next, ...deriveChecked(merged) });
  },

  setPractitionerStaffName: (staffName) => {
    const current = get().practitionerScanned;
    if (!current) return;
    const practitionerScanned = { ...current, staffName };
    const merged: PatientIdCheckData = { ...get(), practitionerScanned };
    set({ practitionerScanned, ...deriveChecked(merged) });
  },

  setPatientVisualConfirmed: (patientVisualConfirmed) => {
    const merged: PatientIdCheckData = { ...get(), patientVisualConfirmed };
    set({ patientVisualConfirmed, ...deriveChecked(merged) });
  },

  setPatientConfirmer: (type) => set({ patientConfirmer: type }),

  setPresetReason: (code) => set({ presetReasonCode: code }),

  setCustomReason: (text) => set({ customReason: text }),

  setItemVisualChecked: (itemVisualChecked) => {
    const merged: PatientIdCheckData = { ...get(), itemVisualChecked };
    set({ itemVisualChecked, ...deriveChecked(merged) });
  },

  setManualPractitionerId: (id) => set({ manualPractitionerId: id, idValidationError: null }),

  registerManualPractitionerId: () => {
    const { manualPractitionerId } = get();
    if (!/^[A-Za-z0-9]+$/.test(manualPractitionerId)) {
      set({ idValidationError: ja.deptInstruction.patientIdCheck.errors.idInvalidFormat });
      return false;
    }
    const merged: PatientIdCheckData = { ...get() };
    set({ idValidationError: null, ...deriveChecked(merged) });
    return true;
  },

  setIdValidationError: (error) => set({ idValidationError: error }),

  reset: () => set(INITIAL_STATE),
}));
