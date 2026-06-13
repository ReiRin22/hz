/**
 * broughtMedication Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const broughtMedicationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type BroughtMedicationSchemaType = z.infer<typeof broughtMedicationSchema>;
