/**
 * ecgBoneDensity Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const ecgBoneDensitySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type EcgBoneDensitySchemaType = z.infer<typeof ecgBoneDensitySchema>;
