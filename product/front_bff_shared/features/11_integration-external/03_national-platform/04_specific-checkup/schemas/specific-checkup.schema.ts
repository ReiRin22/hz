/**
 * specificCheckup Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const specificCheckupSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SpecificCheckupSchemaType = z.infer<typeof specificCheckupSchema>;
