'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRecordInputStore } from '../stores/recordInput.store';
import { fetchComments, fetchDrafts } from '../repository/recordInput.repository';
import type { CommentOption, DraftViewModel, TemplateViewModel } from '../types/recordInput.type';
import { BffApiError } from '@/shared/utils/bff-error';

/**
 * EVT_LOAD_COMMENTS / EVT_UI_APPLY_COMMENT / EVT_UI_APPLY_TEMPLATE / EVT_UI_APPLY_DRAFT
 * / EVT_OPEN_SCHEMA 等のUI操作ハンドラー群。
 */
export function useRecordInputActions(params: {
  patientId: string;
  onLoadComments?: (comments: CommentOption[]) => void;
  onLoadDrafts?: (drafts: DraftViewModel[]) => void;
  onNavigateToSchema?: () => void;
}) {
  const router = useRouter();
  const setSoapText = useRecordInputStore((s) => s.setSoapText);
  const soapText = useRecordInputStore((s) => s.soapText);
  const setHasDraft = useRecordInputStore((s) => s.setHasDraft);
  const setIsVoiceActive = useRecordInputStore((s) => s.setIsVoiceActive);
  const isVoiceActive = useRecordInputStore((s) => s.isVoiceActive);

  /** EVT_LOAD_COMMENTS: コメント一覧取得 */
  const handleLoadComments = useCallback(async (type: 'MY' | 'PATIENT' | 'DEPT') => {
    try {
      const data = await fetchComments({ type, patientId: params.patientId });
      const comments: CommentOption[] = data.myComments.map((c) => ({
        id: c.id,
        content: c.content,
        type: c.type,
      }));
      params.onLoadComments?.(comments);
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [params.patientId, params.onLoadComments, router]);

  /** EVT_UI_APPLY_COMMENT: 選択したコメントをテキストエリアに追記 */
  const handleApplyComment = useCallback((content: string) => {
    setSoapText(soapText + content);
  }, [soapText, setSoapText]);

  /** EVT_UI_APPLY_TEMPLATE: 選択したテンプレートをテキストエリアに反映 */
  const handleApplyTemplate = useCallback((template: TemplateViewModel) => {
    setSoapText(template.content);
  }, [setSoapText]);

  /** EVT_UI_APPLY_DRAFT: 選択した下書きをテキストエリアに反映 */
  const handleApplyDraft = useCallback((draft: DraftViewModel) => {
    setSoapText(draft.soapContent);
  }, [setSoapText]);

  /** EVT_OPEN_SCHEMA: REC002 に遷移 */
  const handleOpenSchema = useCallback(() => {
    params.onNavigateToSchema?.();
  }, [params.onNavigateToSchema]);

  /** ACT_OPEN_DRAFT_LIST: 下書き一覧再取得 */
  const handleLoadDrafts = useCallback(async () => {
    try {
      const data = await fetchDrafts({ patientId: params.patientId });
      setHasDraft(data.drafts.length > 0);
      const drafts: DraftViewModel[] = data.drafts.map((d) => ({
        id: d.id,
        soapContent: d.soapContent,
        savedAt: d.savedAt,
      }));
      params.onLoadDrafts?.(drafts);
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [params.patientId, params.onLoadDrafts, setHasDraft, router]);

  /** ACT_START_VOICE: 音声入力トグル */
  const handleToggleVoice = useCallback(() => {
    setIsVoiceActive(!isVoiceActive);
  }, [isVoiceActive, setIsVoiceActive]);

  return {
    handleLoadComments,
    handleApplyComment,
    handleApplyTemplate,
    handleApplyDraft,
    handleOpenSchema,
    handleLoadDrafts,
    handleToggleVoice,
  };
}
