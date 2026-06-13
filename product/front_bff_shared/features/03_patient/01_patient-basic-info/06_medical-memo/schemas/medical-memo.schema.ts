/**
 * medicalMemo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const medicalMemoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MedicalMemoSchemaType = z.infer<typeof medicalMemoSchema>;
