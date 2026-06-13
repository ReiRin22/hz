/**
 * nursingCareSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingCareSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingCareSettingSchemaType = z.infer<typeof nursingCareSettingSchema>;
