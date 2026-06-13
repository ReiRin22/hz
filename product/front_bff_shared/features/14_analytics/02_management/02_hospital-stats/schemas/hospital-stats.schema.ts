/**
 * hospitalStats Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const hospitalStatsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type HospitalStatsSchemaType = z.infer<typeof hospitalStatsSchema>;
