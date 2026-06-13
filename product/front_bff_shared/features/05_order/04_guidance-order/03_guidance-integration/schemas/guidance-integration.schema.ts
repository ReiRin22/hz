/**
 * guidanceIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const guidanceIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type GuidanceIntegrationSchemaType = z.infer<typeof guidanceIntegrationSchema>;
