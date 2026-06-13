/**
 * compositeIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const compositeIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type CompositeIntegrationSchemaType = z.infer<typeof compositeIntegrationSchema>;
