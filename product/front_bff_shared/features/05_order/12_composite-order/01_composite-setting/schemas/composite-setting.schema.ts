/**
 * compositeSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const compositeSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type CompositeSettingSchemaType = z.infer<typeof compositeSettingSchema>;
