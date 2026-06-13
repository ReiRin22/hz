/**
 * patientIdCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const patientIdCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PatientIdCheckSchemaType = z.infer<typeof patientIdCheckSchema>;
