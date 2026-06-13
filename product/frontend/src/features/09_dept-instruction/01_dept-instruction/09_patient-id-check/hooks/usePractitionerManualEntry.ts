'use client';

import { useCallback } from 'react';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';

interface UsePractitionerManualEntryReturn {
  manualPractitionerId: string;
  idValidationError: string | null;
  setManualPractitionerId: (id: string) => void;
  register: () => boolean;
}

export function usePractitionerManualEntry(): UsePractitionerManualEntryReturn {
  const manualPractitionerId = usePatientIdCheckStore((s) => s.manualPractitionerId);
  const idValidationError = usePatientIdCheckStore((s) => s.idValidationError);
  const setManualPractitionerId = usePatientIdCheckStore((s) => s.setManualPractitionerId);
  const registerManualPractitionerId = usePatientIdCheckStore((s) => s.registerManualPractitionerId);

  const register = useCallback((): boolean => {
    return registerManualPractitionerId();
  }, [registerManualPractitionerId]);

  return { manualPractitionerId, idValidationError, setManualPractitionerId, register };
}
