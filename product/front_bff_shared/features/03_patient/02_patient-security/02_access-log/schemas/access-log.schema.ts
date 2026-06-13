/**
 * accessLog Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const accessLogSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AccessLogSchemaType = z.infer<typeof accessLogSchema>;
