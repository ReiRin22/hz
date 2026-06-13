/**
 * variousLists Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const variousListsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type VariousListsSchemaType = z.infer<typeof variousListsSchema>;
