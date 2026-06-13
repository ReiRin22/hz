/**
 * specimenSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const specimenSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SpecimenSystemSchemaType = z.infer<typeof specimenSystemSchema>;
