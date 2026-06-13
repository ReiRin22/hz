/**
 * revisitReception Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const revisitReceptionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RevisitReceptionSchemaType = z.infer<typeof revisitReceptionSchema>;
