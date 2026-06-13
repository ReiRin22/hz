/**
 * rehabSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const rehabSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RehabSettingSchemaType = z.infer<typeof rehabSettingSchema>;
