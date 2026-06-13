/**
 * notification Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const notificationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NotificationSchemaType = z.infer<typeof notificationSchema>;
