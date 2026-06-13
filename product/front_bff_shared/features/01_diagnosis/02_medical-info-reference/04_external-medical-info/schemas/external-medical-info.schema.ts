/**
 * externalMedicalInfo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const externalMedicalInfoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ExternalMedicalInfoSchemaType = z.infer<typeof externalMedicalInfoSchema>;
