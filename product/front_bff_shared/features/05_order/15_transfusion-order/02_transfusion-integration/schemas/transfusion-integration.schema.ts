/**
 * transfusionIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const transfusionIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TransfusionIntegrationSchemaType = z.infer<typeof transfusionIntegrationSchema>;
