/**
 * chat Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const chatSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ChatSchemaType = z.infer<typeof chatSchema>;
