/**
 * nursingCareIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingCareIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingCareIntegrationSchemaType = z.infer<typeof nursingCareIntegrationSchema>;
