/**
 * transfusionSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const transfusionSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TransfusionSettingSchemaType = z.infer<typeof transfusionSettingSchema>;
