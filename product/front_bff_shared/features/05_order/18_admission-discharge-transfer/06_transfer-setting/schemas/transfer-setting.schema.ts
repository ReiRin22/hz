/**
 * transferSetting Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const transferSettingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TransferSettingSchemaType = z.infer<typeof transferSettingSchema>;
