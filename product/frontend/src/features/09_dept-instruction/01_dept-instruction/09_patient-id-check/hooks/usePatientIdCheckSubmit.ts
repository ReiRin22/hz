'use client';

import { useCallback, useState } from 'react';
import { isAxiosError } from 'axios';
import { ja } from '@/shared/i18n/ja';
import { executePatientIdCheck } from '../repository/usePatientIdCheck';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';
import type { PatientIdCheckResult } from '../types/patientIdCheck.viewmodel';
import type { PostPatientIdCheckCompleteResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

function mapResult(raw: PostPatientIdCheckCompleteResponse): PatientIdCheckResult {
  return {
    sessionId: raw.sessionId,
    completedAt: raw.completedAt,
    recordedAt: raw.recordedAt,
  };
}

interface UsePatientIdCheckSubmitReturn {
  isSubmitting: boolean;
  submitError: string | null;
  submit: (checkedBy: string) => Promise<PatientIdCheckResult | null>;
}

export function usePatientIdCheckSubmit(
  orderId: string,
  onComplete: (result: PatientIdCheckResult) => void,
): UsePatientIdCheckSubmitReturn {
  const isAllChecked = usePatientIdCheckStore((s) => s.isAllChecked);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (checkedBy: string): Promise<PatientIdCheckResult | null> => {
      if (!isAllChecked) {
        return null;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const snapshot = usePatientIdCheckStore.getState();
        // TODO: checkedBy を職員ID（staffId）に置き換える（現在は userName を流用）
        const raw = await executePatientIdCheck(orderId, {
          patientBarcodeRead: snapshot.patientScanned?.value,
          itemBarcodeRead: snapshot.itemScanned?.value,
          practitionerBarcodeRead: snapshot.practitionerScanned?.value,
          patientVisualConfirmed: snapshot.patientVisualConfirmed,
          patientConfirmer: snapshot.patientConfirmer,
          patientConfirmReason:
            snapshot.presetReasonCode || snapshot.customReason
              ? {
                  presetCode: snapshot.presetReasonCode || undefined,
                  customText: snapshot.customReason || undefined,
                }
              : undefined,
          itemVisualConfirmed: snapshot.itemVisualChecked,
          manualPractitionerId: snapshot.manualPractitionerId || undefined,
          checkedBy: checkedBy,
          completedAt: new Date().toISOString(),
        });
        const result = mapResult(raw);
        onComplete(result);
        return result;
      } catch (err) {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 409) {
            setSubmitError(ja.deptInstruction.patientIdCheck.errors.alreadyChecked);
          } else if (status === 422) {
            setSubmitError(ja.deptInstruction.patientIdCheck.errors.invalidInput);
          } else {
            setSubmitError(ja.deptInstruction.patientIdCheck.errors.submitFailed);
          }
        } else {
          setSubmitError(ja.common.messages.unknownError);
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [orderId, isAllChecked, onComplete],
  );

  return { isSubmitting, submitError, submit };
}
