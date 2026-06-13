/**
 * inpatientPrescription Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const inpatientPrescriptionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type InpatientPrescriptionSchemaType = z.infer<typeof inpatientPrescriptionSchema>;
