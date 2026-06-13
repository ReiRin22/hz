/**
 * orderIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const orderIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OrderIntegrationSchemaType = z.infer<typeof orderIntegrationSchema>;
