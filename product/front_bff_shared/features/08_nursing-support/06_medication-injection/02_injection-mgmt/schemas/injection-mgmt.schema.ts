/**
 * injectionMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const injectionMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type InjectionMgmtSchemaType = z.infer<typeof injectionMgmtSchema>;
