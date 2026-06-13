/**
 * mwm Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const mwmSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MwmSchemaType = z.infer<typeof mwmSchema>;
