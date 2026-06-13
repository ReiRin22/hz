/**
 * form1Inpatient Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const form1InpatientSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type Form1InpatientSchemaType = z.infer<typeof form1InpatientSchema>;
