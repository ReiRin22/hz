/**
 * specimenOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const specimenOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SpecimenOutputSchemaType = z.infer<typeof specimenOutputSchema>;
