/**
 * patientList Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const patientListSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PatientListSchemaType = z.infer<typeof patientListSchema>;
