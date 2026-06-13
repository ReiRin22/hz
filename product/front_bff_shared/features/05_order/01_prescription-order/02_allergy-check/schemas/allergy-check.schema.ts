/**
 * allergyCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const allergyCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AllergyCheckSchemaType = z.infer<typeof allergyCheckSchema>;
