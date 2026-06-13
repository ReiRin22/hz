'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRecordInputStore } from '../stores/recordInput.store';
import { fetchExistingRecord, fetchDrafts } from '../repository/recordInput.repository';
import { BffApiError } from '@/shared/utils/bff-error';

type RecordInputInitParams = {
  patientId: string;
  /** 修正モード時のみ指定 */
  recordId?: string;
  /** 記載者名（ログインユーザー） */
  loginUserName: string;
};

/**
 * EVT_INIT_NEW / EVT_INIT_EDIT / EVT_LOAD_DRAFTS
 * マウント時に初期データを取得してストアにセットする。
 */
export function useRecordInputInit({ patientId, recordId, loginUserName }: RecordInputInitParams) {
  const setMode = useRecordInputStore((s) => s.setMode);
  const setRecordDate = useRecordInputStore((s) => s.setRecordDate);
  const setAuthorName = useRecordInputStore((s) => s.setAuthorName);
  const setSoapText = useRecordInputStore((s) => s.setSoapText);
  const setIsEditable = useRecordInputStore((s) => s.setIsEditable);
  const setHasDraft = useRecordInputStore((s) => s.setHasDraft);

  // EVT_INIT_NEW / EVT_INIT_EDIT: 初期表示
  useEffect(() => {
    let cancelled = false;

    if (!recordId) {
      setMode('new');
      setAuthorName(loginUserName);
      return;
    }

    setMode('edit');
    fetchExistingRecord({ patientId, recordId })
      .then((data) => {
        if (cancelled) return;
        setRecordDate(data.recordDate);
        setAuthorName(data.recorderName);
        setSoapText(data.soapContent);
        setIsEditable(data.status !== 'CONFIRMED');
      })
      .catch((err) => {
        if (cancelled) return;
        // 初期表示失敗は画面全体が使えないため error.tsx に委譲
        throw err;
      });

    return () => {
      cancelled = true;
    };
  }, [patientId, recordId, loginUserName]);

  // EVT_LOAD_DRAFTS: 下書き一覧取得（マウント時）
  useEffect(() => {
    let cancelled = false;

    fetchDrafts({ patientId })
      .then((data) => {
        if (cancelled) return;
        setHasDraft(data.drafts.length > 0);
      })
      .catch((err) => {
        if (cancelled) return;
        // 下書き取得失敗は軽微（操作継続可能）
        toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);
}
