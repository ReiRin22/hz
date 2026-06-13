/**
 * proxyRejection Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const proxyRejectionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ProxyRejectionSchemaType = z.infer<typeof proxyRejectionSchema>;
