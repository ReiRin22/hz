/**
 * medicationHistory Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const medicationHistorySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MedicationHistorySchemaType = z.infer<typeof medicationHistorySchema>;
