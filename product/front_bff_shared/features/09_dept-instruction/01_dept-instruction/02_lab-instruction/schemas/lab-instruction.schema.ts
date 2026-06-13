/**
 * labInstruction Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const labInstructionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type LabInstructionSchemaType = z.infer<typeof labInstructionSchema>;
