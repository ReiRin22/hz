/**
 * duplicateCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const duplicateCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DuplicateCheckSchemaType = z.infer<typeof duplicateCheckSchema>;
