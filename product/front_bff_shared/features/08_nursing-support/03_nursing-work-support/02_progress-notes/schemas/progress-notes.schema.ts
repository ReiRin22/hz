/**
 * progressNotes Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const progressNotesSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ProgressNotesSchemaType = z.infer<typeof progressNotesSchema>;
