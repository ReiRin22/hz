/**
 * help Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const helpSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type HelpSchemaType = z.infer<typeof helpSchema>;
