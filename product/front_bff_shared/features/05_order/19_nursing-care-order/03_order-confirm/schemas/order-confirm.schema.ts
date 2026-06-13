/**
 * orderConfirm Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const orderConfirmSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OrderConfirmSchemaType = z.infer<typeof orderConfirmSchema>;
