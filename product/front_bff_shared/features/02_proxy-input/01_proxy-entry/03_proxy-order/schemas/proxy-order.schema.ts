/**
 * proxyOrder Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const proxyOrderSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ProxyOrderSchemaType = z.infer<typeof proxyOrderSchema>;
