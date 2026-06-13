/**
 * nursingMgmtJournal Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingMgmtJournalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingMgmtJournalSchemaType = z.infer<typeof nursingMgmtJournalSchema>;
