/**
 * mealStats Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const mealStatsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MealStatsSchemaType = z.infer<typeof mealStatsSchema>;
