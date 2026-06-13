/**
 * specimenSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const specimenSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SpecimenSettingSchemaType = z.infer<typeof specimenSettingSchema>;
