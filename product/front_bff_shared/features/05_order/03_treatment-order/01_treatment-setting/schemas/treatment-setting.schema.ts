/**
 * treatmentSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const treatmentSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TreatmentSettingSchemaType = z.infer<typeof treatmentSettingSchema>;
