/**
 * form1Outpatient Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const form1OutpatientSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type Form1OutpatientSchemaType = z.infer<typeof form1OutpatientSchema>;
