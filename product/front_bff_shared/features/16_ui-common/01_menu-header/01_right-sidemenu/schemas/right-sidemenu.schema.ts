/**
 * rightSidemenu Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rightSidemenuSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RightSidemenuSchemaType = z.infer<typeof rightSidemenuSchema>;
