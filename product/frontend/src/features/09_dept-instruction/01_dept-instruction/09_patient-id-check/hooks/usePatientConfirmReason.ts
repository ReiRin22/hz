'use client';

import { useCallback, useState } from 'react';
import { ja } from '@/shared/i18n/ja';
import { executePatientConfirmReason } from '../repository/usePatientIdCheck';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';

interface UsePatientConfirmReasonReturn {
  isSaving: boolean;
  saveError: string | null;
  save: (savedBy: string) => Promise<boolean>;
}

export function usePatientConfirmReason(orderId: string): UsePatientConfirmReasonReturn {
  const presetReasonCode = usePatientIdCheckStore((s) => s.presetReasonCode);
  const customReason = usePatientIdCheckStore((s) => s.customReason);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = useCallback(
    async (savedBy: string): Promise<boolean> => {
      if (!presetReasonCode && !customReason.trim()) {
        setSaveError(ja.deptInstruction.patientIdCheck.errors.reasonRequired);
        return false;
      }
      setIsSaving(true);
      setSaveError(null);
      try {
        await executePatientConfirmReason(orderId, {
          presetCode: presetReasonCode || undefined,
          customText: customReason.trim() || undefined,
          savedBy: savedBy,
          timestamp: new Date().toISOString(),
        });
        return true;
      } catch {
        setSaveError(ja.deptInstruction.patientIdCheck.errors.reasonSaveFailed);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [orderId, presetReasonCode, customReason],
  );

  return { isSaving, saveError, save };
}
