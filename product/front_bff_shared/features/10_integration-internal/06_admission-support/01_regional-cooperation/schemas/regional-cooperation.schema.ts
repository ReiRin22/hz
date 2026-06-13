/**
 * regionalCooperation Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const regionalCooperationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RegionalCooperationSchemaType = z.infer<typeof regionalCooperationSchema>;
