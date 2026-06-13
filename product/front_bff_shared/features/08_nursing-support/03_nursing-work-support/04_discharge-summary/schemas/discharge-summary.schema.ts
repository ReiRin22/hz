/**
 * dischargeSummary Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const dischargeSummarySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DischargeSummarySchemaType = z.infer<typeof dischargeSummarySchema>;
