/**
 * auth Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const authSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AuthSchemaType = z.infer<typeof authSchema>;
