/**
 * interfaceMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const interfaceMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type InterfaceMgmtSchemaType = z.infer<typeof interfaceMgmtSchema>;
