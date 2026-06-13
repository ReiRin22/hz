/**
 * medicalAdlEval Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const medicalAdlEvalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MedicalAdlEvalSchemaType = z.infer<typeof medicalAdlEvalSchema>;
