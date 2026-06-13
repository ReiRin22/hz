/**
 * leftSidemenu Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const leftSidemenuSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type LeftSidemenuSchemaType = z.infer<typeof leftSidemenuSchema>;
