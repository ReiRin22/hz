/**
 * questionnaire Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const questionnaireSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type QuestionnaireSchemaType = z.infer<typeof questionnaireSchema>;
