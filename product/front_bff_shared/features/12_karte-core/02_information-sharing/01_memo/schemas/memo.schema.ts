/**
 * memo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const memoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MemoSchemaType = z.infer<typeof memoSchema>;
