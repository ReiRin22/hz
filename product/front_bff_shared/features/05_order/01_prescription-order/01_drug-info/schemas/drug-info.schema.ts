/**
 * drugInfo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const drugInfoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DrugInfoSchemaType = z.infer<typeof drugInfoSchema>;
