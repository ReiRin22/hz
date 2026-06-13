/**
 * treatmentIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const treatmentIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TreatmentIntegrationSchemaType = z.infer<typeof treatmentIntegrationSchema>;
