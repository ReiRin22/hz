/**
 * pathologySetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pathologySettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PathologySettingSchemaType = z.infer<typeof pathologySettingSchema>;
