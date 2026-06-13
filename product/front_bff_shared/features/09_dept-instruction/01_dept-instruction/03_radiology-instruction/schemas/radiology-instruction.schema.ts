/**
 * radiologyInstruction Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const radiologyInstructionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RadiologyInstructionSchemaType = z.infer<typeof radiologyInstructionSchema>;
