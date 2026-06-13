/**
 * shiftSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const shiftSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ShiftSystemSchemaType = z.infer<typeof shiftSystemSchema>;
