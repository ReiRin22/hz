/**
 * utilizationRate Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const utilizationRateSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type UtilizationRateSchemaType = z.infer<typeof utilizationRateSchema>;
