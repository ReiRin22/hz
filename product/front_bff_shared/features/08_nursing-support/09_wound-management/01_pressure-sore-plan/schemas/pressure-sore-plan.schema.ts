/**
 * pressureSorePlan Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pressureSorePlanSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PressureSorePlanSchemaType = z.infer<typeof pressureSorePlanSchema>;
