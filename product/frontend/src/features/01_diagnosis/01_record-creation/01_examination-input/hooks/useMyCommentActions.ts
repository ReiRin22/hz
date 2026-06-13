'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveMyComment, removeMyComment } from '../repository/recordInput.repository';
import { BffApiError } from '@/shared/utils/bff-error';

/**
 * EVT_SAVE_MY_COMMENT / EVT_DELETE_MY_COMMENT: Myコメント CRUD。
 */
export function useMyCommentActions(params: { onUpdated?: () => void }) {
  const router = useRouter();

  /** EVT_SAVE_MY_COMMENT: Myコメント保存（新規=POST / 更新=PUT） */
  const handleSaveMyComment = useCallback(async (args: {
    commentId?: string;
    content: string;
  }) => {
    try {
      await saveMyComment({ commentId: args.commentId, content: args.content });
      params.onUpdated?.();
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [params.onUpdated, router]);

  /** EVT_DELETE_MY_COMMENT: Myコメント削除 */
  const handleDeleteMyComment = useCallback(async (commentId: string) => {
    try {
      await removeMyComment(commentId);
      params.onUpdated?.();
    } catch (err) {
      if (err instanceof BffApiError && err.code === 'E401') {
        router.push('/login');
        return;
      }
      toast.error(err instanceof BffApiError ? err.message : 'システムエラーが発生しました');
    }
  }, [params.onUpdated, router]);

  return { handleSaveMyComment, handleDeleteMyComment };
}
