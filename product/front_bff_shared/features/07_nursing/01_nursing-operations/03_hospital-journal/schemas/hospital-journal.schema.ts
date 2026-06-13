/**
 * hospitalJournal Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const hospitalJournalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type HospitalJournalSchemaType = z.infer<typeof hospitalJournalSchema>;
