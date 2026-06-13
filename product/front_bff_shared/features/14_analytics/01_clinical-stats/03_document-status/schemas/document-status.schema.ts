/**
 * documentStatus Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const documentStatusSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DocumentStatusSchemaType = z.infer<typeof documentStatusSchema>;
