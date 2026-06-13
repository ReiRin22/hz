/**
 * handover Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const handoverSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type HandoverSchemaType = z.infer<typeof handoverSchema>;
