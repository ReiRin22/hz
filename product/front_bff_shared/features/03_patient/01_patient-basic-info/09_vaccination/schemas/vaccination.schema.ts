/**
 * vaccination Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const vaccinationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type VaccinationSchemaType = z.infer<typeof vaccinationSchema>;
