/**
 * alertSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const alertSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AlertSettingSchemaType = z.infer<typeof alertSettingSchema>;
