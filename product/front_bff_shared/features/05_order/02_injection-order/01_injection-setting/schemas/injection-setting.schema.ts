/**
 * injectionSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const injectionSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type InjectionSettingSchemaType = z.infer<typeof injectionSettingSchema>;
