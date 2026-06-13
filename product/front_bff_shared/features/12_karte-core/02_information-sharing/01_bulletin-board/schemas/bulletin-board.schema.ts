/**
 * bulletinBoard Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const bulletinBoardSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type BulletinBoardSchemaType = z.infer<typeof bulletinBoardSchema>;
