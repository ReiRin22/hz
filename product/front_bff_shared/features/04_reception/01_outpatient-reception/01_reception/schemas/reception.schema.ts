/**
 * reception Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const receptionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ReceptionSchemaType = z.infer<typeof receptionSchema>;
