/**
 * nursingNecessityStats Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingNecessityStatsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingNecessityStatsSchemaType = z.infer<typeof nursingNecessityStatsSchema>;
