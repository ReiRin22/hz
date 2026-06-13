'use client';

import { useCallback } from 'react';
import { useSchemaCreationStore } from '../stores/schemaCreation.store';
import { saveSchema } from '../repository/schema-creation.repository';

type Params = {
  mode: 'new' | 'edit';
  schemaUuid?: string;
  /** 保存完了後に親コンポーネントへ通知するコールバック */
  onConfirm: (schemaUuid: string, base64Image: string) => void;
};

/** EVT_CONFIRM: キャンバス画像をBase64エンコードしてBFFに保存し、onConfirmで親に通知する */
export function useSchemaCreationSubmit({ mode, schemaUuid, onConfirm }: Params) {
  const isSubmitting = useSchemaCreationStore((s) => s.isSubmitting);
  const setIsSubmitting = useSchemaCreationStore((s) => s.setIsSubmitting);
  const hasDrawContent = useSchemaCreationStore((s) => s.hasDrawContent);

  const handleConfirm = useCallback(
    async (imageData: string): Promise<void> => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const result = await saveSchema({ mode, schemaUuid, imageData });
        onConfirm(result.schemaUuid, imageData);
      } catch {
        // Phase 7 でエラーハンドリングを詳細化する
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, schemaUuid, onConfirm, isSubmitting, setIsSubmitting],
  );

  return { isSubmitting, hasDrawContent, handleConfirm };
}
