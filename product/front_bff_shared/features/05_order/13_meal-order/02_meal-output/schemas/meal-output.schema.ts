/**
 * mealOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const mealOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MealOutputSchemaType = z.infer<typeof mealOutputSchema>;
