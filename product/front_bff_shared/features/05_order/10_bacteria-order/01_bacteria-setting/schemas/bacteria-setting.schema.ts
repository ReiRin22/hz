/**
 * bacteriaSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const bacteriaSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type BacteriaSettingSchemaType = z.infer<typeof bacteriaSettingSchema>;
