/**
 * vitalSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const vitalSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type VitalSystemSchemaType = z.infer<typeof vitalSystemSchema>;
