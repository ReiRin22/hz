/**
 * dischargeSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const dischargeSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DischargeSettingSchemaType = z.infer<typeof dischargeSettingSchema>;
