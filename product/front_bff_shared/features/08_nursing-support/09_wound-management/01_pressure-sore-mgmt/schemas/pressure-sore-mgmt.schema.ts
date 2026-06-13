/**
 * pressureSoreMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pressureSoreMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PressureSoreMgmtSchemaType = z.infer<typeof pressureSoreMgmtSchema>;
