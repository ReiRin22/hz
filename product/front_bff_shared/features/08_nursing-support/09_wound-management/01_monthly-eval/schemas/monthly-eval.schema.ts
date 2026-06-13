/**
 * monthlyEval Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const monthlyEvalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MonthlyEvalSchemaType = z.infer<typeof monthlyEvalSchema>;
