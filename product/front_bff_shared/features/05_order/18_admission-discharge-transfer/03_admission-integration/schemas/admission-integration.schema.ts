/**
 * admissionIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const admissionIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AdmissionIntegrationSchemaType = z.infer<typeof admissionIntegrationSchema>;
