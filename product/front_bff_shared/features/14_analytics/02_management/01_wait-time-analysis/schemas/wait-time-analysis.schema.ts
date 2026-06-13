/**
 * waitTimeAnalysis Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const waitTimeAnalysisSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type WaitTimeAnalysisSchemaType = z.infer<typeof waitTimeAnalysisSchema>;
