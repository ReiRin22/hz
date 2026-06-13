/**
 * dialysisSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const dialysisSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DialysisSettingSchemaType = z.infer<typeof dialysisSettingSchema>;
