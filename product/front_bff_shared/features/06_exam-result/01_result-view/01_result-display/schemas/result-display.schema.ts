/**
 * resultDisplay Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const resultDisplaySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ResultDisplaySchemaType = z.infer<typeof resultDisplaySchema>;
