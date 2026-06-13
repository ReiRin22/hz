/**
 * patientAttributeCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const patientAttributeCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PatientAttributeCheckSchemaType = z.infer<typeof patientAttributeCheckSchema>;
