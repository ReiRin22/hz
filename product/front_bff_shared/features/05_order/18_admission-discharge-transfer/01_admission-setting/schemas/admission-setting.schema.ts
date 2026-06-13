/**
 * admissionSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const admissionSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AdmissionSettingSchemaType = z.infer<typeof admissionSettingSchema>;
