/**
 * todo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const todoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TodoSchemaType = z.infer<typeof todoSchema>;
