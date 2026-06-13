/**
 * medicalAccounting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const medicalAccountingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MedicalAccountingSchemaType = z.infer<typeof medicalAccountingSchema>;
