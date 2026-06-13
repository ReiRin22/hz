/**
 * staffAssignment Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const staffAssignmentSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type StaffAssignmentSchemaType = z.infer<typeof staffAssignmentSchema>;
