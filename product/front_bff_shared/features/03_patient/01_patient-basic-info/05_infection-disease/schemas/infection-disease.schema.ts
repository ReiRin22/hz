/**
 * infectionDisease Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const infectionDiseaseSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type InfectionDiseaseSchemaType = z.infer<typeof infectionDiseaseSchema>;
