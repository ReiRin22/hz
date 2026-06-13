/**
 * outsourcedExam Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const outsourcedExamSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OutsourcedExamSchemaType = z.infer<typeof outsourcedExamSchema>;
