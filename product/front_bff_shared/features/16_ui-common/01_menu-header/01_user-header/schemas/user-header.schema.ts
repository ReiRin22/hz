/**
 * userHeader Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const userHeaderSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type UserHeaderSchemaType = z.infer<typeof userHeaderSchema>;
