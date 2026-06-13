/**
 * userManagement Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const userManagementSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type UserManagementSchemaType = z.infer<typeof userManagementSchema>;
