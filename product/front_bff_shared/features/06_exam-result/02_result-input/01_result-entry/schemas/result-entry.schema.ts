/**
 * resultEntry Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const resultEntrySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ResultEntrySchemaType = z.infer<typeof resultEntrySchema>;
