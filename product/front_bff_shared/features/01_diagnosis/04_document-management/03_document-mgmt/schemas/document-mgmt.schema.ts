/**
 * documentMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const documentMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DocumentMgmtSchemaType = z.infer<typeof documentMgmtSchema>;
