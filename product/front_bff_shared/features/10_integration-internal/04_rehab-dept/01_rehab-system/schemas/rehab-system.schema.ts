/**
 * rehabSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rehabSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RehabSystemSchemaType = z.infer<typeof rehabSystemSchema>;
