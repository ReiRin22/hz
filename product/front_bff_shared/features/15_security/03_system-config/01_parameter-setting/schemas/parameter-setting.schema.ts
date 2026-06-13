/**
 * parameterSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const parameterSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ParameterSettingSchemaType = z.infer<typeof parameterSettingSchema>;
