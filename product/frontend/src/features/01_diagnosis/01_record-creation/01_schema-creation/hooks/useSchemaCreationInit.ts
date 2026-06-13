'use client';

import { useEffect, useState } from 'react';
import { useSchemaCreationStore } from '../stores/schemaCreation.store';
import { initializeSchemaCreation, type SchemaCreationInitData } from '../repository/schema-creation.repository';

type Params = {
  category: string;
  mode: 'new' | 'edit';
  schemaUuid?: string;
};

/** EVT_INIT01: 初期表示 — テンプレート・お気に入りを並列取得してストアにセット */
export function useSchemaCreationInit({ category, mode, schemaUuid }: Params) {
  const [isLoading, setIsLoading] = useState(true);
  const [initData, setInitData] = useState<SchemaCreationInitData | null>(null);

  const setFavoriteTemplateIds = useSchemaCreationStore((s) => s.setFavoriteTemplateIds);
  const setSelectedBodyPart = useSchemaCreationStore((s) => s.setSelectedBodyPart);
  const setMode = useSchemaCreationStore((s) => s.setMode);

  useEffect(() => {
    let cancelled = false;

    setMode(mode);
    setSelectedBodyPart(category);
    setIsLoading(true);

    initializeSchemaCreation({ category, mode, schemaUuid })
      .then((data) => {
        if (cancelled) return;
        setFavoriteTemplateIds(data.favorites.favoriteTemplateIds);
        setInitData(data);
      })
      .catch(() => {
        // Phase 7 でエラーハンドリングを詳細化する
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, mode, schemaUuid]);

  return { isLoading, initData };
}
