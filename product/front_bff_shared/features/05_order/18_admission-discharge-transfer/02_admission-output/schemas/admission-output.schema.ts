/**
 * admissionOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const admissionOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AdmissionOutputSchemaType = z.infer<typeof admissionOutputSchema>;
