/**
 * dpc Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const dpcSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DpcSchemaType = z.infer<typeof dpcSchema>;
