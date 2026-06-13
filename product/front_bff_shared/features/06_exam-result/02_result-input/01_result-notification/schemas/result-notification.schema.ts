/**
 * resultNotification Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const resultNotificationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ResultNotificationSchemaType = z.infer<typeof resultNotificationSchema>;
