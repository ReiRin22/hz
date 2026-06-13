/**
 * genericRate Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const genericRateSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type GenericRateSchemaType = z.infer<typeof genericRateSchema>;
