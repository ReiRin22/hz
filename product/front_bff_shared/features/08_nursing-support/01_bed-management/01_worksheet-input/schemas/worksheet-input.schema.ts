/**
 * worksheetInput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const worksheetInputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type WorksheetInputSchemaType = z.infer<typeof worksheetInputSchema>;
