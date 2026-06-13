/**
 * print Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const printSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PrintSchemaType = z.infer<typeof printSchema>;
