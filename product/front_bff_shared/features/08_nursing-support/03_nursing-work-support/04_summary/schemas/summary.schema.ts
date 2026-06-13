/**
 * summary Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const summarySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SummarySchemaType = z.infer<typeof summarySchema>;
