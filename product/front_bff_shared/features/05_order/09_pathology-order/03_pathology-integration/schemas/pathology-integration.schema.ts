/**
 * pathologyIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pathologyIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PathologyIntegrationSchemaType = z.infer<typeof pathologyIntegrationSchema>;
