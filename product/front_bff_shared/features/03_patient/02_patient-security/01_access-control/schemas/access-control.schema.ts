/**
 * accessControl Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const accessControlSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AccessControlSchemaType = z.infer<typeof accessControlSchema>;
