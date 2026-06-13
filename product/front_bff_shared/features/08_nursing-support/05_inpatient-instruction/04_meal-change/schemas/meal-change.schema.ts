/**
 * mealChange Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const mealChangeSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MealChangeSchemaType = z.infer<typeof mealChangeSchema>;
