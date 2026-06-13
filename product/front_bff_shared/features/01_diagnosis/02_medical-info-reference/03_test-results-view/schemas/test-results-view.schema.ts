/**
 * testResultsView Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const testResultsViewSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TestResultsViewSchemaType = z.infer<typeof testResultsViewSchema>;
