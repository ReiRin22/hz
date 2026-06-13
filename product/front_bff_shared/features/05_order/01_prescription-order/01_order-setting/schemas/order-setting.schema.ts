/**
 * orderSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const orderSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OrderSettingSchemaType = z.infer<typeof orderSettingSchema>;
