/**
 * nursingDiagnosis Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingDiagnosisSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingDiagnosisSchemaType = z.infer<typeof nursingDiagnosisSchema>;
