/**
 * worksheetIssue Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const worksheetIssueSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type WorksheetIssueSchemaType = z.infer<typeof worksheetIssueSchema>;
