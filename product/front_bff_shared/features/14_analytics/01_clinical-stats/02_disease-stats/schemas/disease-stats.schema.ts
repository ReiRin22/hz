/**
 * diseaseStats Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const diseaseStatsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DiseaseStatsSchemaType = z.infer<typeof diseaseStatsSchema>;
