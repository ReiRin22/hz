/**
 * surgerySetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const surgerySettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SurgerySettingSchemaType = z.infer<typeof surgerySettingSchema>;
