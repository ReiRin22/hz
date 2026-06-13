/**
 * rehabPlan Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rehabPlanSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RehabPlanSchemaType = z.infer<typeof rehabPlanSchema>;
