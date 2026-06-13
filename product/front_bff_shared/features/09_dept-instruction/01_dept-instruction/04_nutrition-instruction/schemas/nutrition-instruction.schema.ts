/**
 * nutritionInstruction Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nutritionInstructionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NutritionInstructionSchemaType = z.infer<typeof nutritionInstructionSchema>;
