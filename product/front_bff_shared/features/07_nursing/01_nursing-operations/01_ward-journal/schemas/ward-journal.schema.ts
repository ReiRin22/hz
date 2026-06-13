/**
 * wardJournal Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const wardJournalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type WardJournalSchemaType = z.infer<typeof wardJournalSchema>;
