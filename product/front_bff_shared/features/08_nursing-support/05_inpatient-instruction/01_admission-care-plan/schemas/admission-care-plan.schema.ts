/**
 * admissionCarePlan Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const admissionCarePlanSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AdmissionCarePlanSchemaType = z.infer<typeof admissionCarePlanSchema>;
