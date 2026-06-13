/**
 * predictiveInstruction Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const predictiveInstructionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PredictiveInstructionSchemaType = z.infer<typeof predictiveInstructionSchema>;
