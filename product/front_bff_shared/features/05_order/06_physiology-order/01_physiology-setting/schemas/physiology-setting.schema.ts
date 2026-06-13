/**
 * physiologySetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const physiologySettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PhysiologySettingSchemaType = z.infer<typeof physiologySettingSchema>;
