/**
 * rehabIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rehabIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RehabIntegrationSchemaType = z.infer<typeof rehabIntegrationSchema>;
