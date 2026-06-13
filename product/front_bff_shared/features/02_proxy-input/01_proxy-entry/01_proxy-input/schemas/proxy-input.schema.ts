/**
 * proxyInput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const proxyInputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ProxyInputSchemaType = z.infer<typeof proxyInputSchema>;
