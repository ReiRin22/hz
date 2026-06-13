/**
 * endoscopySetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const endoscopySettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type EndoscopySettingSchemaType = z.infer<typeof endoscopySettingSchema>;
