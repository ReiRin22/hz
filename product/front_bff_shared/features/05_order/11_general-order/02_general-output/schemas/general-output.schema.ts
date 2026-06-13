/**
 * generalOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const generalOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type GeneralOutputSchemaType = z.infer<typeof generalOutputSchema>;
