/**
 * ris Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const risSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RisSchemaType = z.infer<typeof risSchema>;
