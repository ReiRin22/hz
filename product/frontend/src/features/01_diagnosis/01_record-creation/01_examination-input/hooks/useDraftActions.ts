'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRecordInputStore } from '../stores/recordInput.store';
import { removeDraft, fetchDrafts } from '../repository/recordInput.repository';
import { BffApiError } from '@/shared/utils/bff-error';

/**
 * EVT_DELETE_DRAFT: 下書き削除・下書き一覧の再同期。
 */
export function useDraftActions(params: { patientId: string }) {
  const router = useRouter();
  const setHasDraft = useRecordInputStore((s) => s.setHasDraft);

  /** EVT_DELETE_DRAFT: 選択した下書きを削除し、残数に応じて hasDraft を更新 */
  const handleDeleteDraft = useCallback(async (draftId: string) => {
    try {
      await removeDraft({ patientId: params.patientId, draftId });
      const data = await fetchDrafts({ patientId: params.patientId });
      setHasDraft(data.drafts.length > 0);
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [params.patientId, setHasDraft, router]);

  return { handleDeleteDraft };
}
