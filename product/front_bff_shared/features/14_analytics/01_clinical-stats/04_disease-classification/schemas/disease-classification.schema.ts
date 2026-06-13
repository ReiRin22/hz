/**
 * diseaseClassification Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const diseaseClassificationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DiseaseClassificationSchemaType = z.infer<typeof diseaseClassificationSchema>;
