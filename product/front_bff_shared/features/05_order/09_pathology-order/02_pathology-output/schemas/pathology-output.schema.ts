/**
 * pathologyOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pathologyOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PathologyOutputSchemaType = z.infer<typeof pathologyOutputSchema>;
