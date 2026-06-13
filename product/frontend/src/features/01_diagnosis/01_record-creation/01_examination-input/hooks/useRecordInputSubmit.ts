'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRecordInputStore } from '../stores/recordInput.store';
import { confirmRecord, saveDraft } from '../repository/recordInput.repository';
import { recordInputSchema } from '../types/recordInput.schema';
import { BffApiError } from '@/shared/utils/bff-error';

/** E001 / E002 バリデーションエラー（フィールド → メッセージ） */
export type RecordInputValidationErrors = Partial<Record<'recordDate' | 'soapContent', string>>;

/**
 * EVT_CONFIRM_RECORD / EVT_SAVE_DRAFT: 確定・一時保存。
 */
export function useRecordInputSubmit(params: {
  patientId: string;
  receptionId: string;
  /** 修正モード時のみ指定 */
  recordId?: string;
  recorderId: string;
  onConfirmed?: (recordId: string) => void;
  onDraftSaved?: () => void;
}) {
  const router = useRouter();
  const mode = useRecordInputStore((s) => s.mode);
  const recordDate = useRecordInputStore((s) => s.recordDate);
  const soapText = useRecordInputStore((s) => s.soapText);
  const setConfirmButtonDisabled = useRecordInputStore((s) => s.setConfirmButtonDisabled);
  const setHasDraft = useRecordInputStore((s) => s.setHasDraft);

  const [validationErrors, setValidationErrors] = useState<RecordInputValidationErrors>({});

  /** EVT_CONFIRM_RECORD: 確定ボタン押下 */
  const handleConfirm = useCallback(async () => {
    // T7-1: E001 / E002 クライアントバリデーション
    const result = recordInputSchema.safeParse({ recordDate, soapContent: soapText });
    if (!result.success) {
      const fieldErrors: RecordInputValidationErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RecordInputValidationErrors;
        fieldErrors[field] = issue.message;
      }
      setValidationErrors(fieldErrors);
      return;
    }
    setValidationErrors({});

    setConfirmButtonDisabled(true);
    try {
      const correlationId = crypto.randomUUID();
      const resultData = await confirmRecord({
        patientId: params.patientId,
        recordId: mode === 'edit' ? params.recordId : undefined,
        body: {
          status: 'CONFIRMED',
          recordDate,
          recorderId: params.recorderId,
          soapContent: soapText,
          receptionId: params.receptionId,
        },
        correlationId,
      });
      params.onConfirmed?.(resultData.id);
    } catch (err) {
      setConfirmButtonDisabled(false);
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [
    mode,
    recordDate,
    soapText,
    params.patientId,
    params.receptionId,
    params.recordId,
    params.recorderId,
    params.onConfirmed,
    setConfirmButtonDisabled,
    router,
  ]);

  /** EVT_SAVE_DRAFT: 一時保存ボタン押下 */
  const handleSaveDraft = useCallback(async () => {
    try {
      await saveDraft({
        patientId: params.patientId,
        body: {
          status: 'DRAFT',
          recordDate,
          recorderId: params.recorderId,
          soapContent: soapText,
          receptionId: params.receptionId,
        },
      });
      setHasDraft(true);
      params.onDraftSaved?.();
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [
    recordDate,
    soapText,
    params.patientId,
    params.receptionId,
    params.recorderId,
    params.onDraftSaved,
    setHasDraft,
    router,
  ]);

  return { handleConfirm, handleSaveDraft, validationErrors };
}
