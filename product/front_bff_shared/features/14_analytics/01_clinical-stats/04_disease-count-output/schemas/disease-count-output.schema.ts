/**
 * diseaseCountOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const diseaseCountOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DiseaseCountOutputSchemaType = z.infer<typeof diseaseCountOutputSchema>;
