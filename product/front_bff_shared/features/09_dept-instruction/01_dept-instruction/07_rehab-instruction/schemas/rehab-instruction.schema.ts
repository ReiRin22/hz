/**
 * rehabInstruction Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rehabInstructionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RehabInstructionSchemaType = z.infer<typeof rehabInstructionSchema>;
