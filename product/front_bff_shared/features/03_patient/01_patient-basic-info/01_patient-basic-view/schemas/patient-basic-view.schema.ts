/**
 * patientBasicView Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const patientBasicViewSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PatientBasicViewSchemaType = z.infer<typeof patientBasicViewSchema>;
