/**
 * guidanceSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const guidanceSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type GuidanceSettingSchemaType = z.infer<typeof guidanceSettingSchema>;
