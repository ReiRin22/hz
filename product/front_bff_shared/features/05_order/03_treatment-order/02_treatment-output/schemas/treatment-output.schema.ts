/**
 * treatmentOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const treatmentOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TreatmentOutputSchemaType = z.infer<typeof treatmentOutputSchema>;
