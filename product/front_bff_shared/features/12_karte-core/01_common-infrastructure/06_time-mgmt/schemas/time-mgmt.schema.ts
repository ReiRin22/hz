/**
 * timeMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const timeMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TimeMgmtSchemaType = z.infer<typeof timeMgmtSchema>;
