/**
 * outpatientJournal Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const outpatientJournalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OutpatientJournalSchemaType = z.infer<typeof outpatientJournalSchema>;
