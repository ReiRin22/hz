/**
 * errorControl Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const errorControlSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ErrorControlSchemaType = z.infer<typeof errorControlSchema>;
