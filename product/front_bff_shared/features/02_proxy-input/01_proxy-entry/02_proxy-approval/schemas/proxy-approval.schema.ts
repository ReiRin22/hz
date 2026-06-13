/**
 * proxyApproval Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const proxyApprovalSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ProxyApprovalSchemaType = z.infer<typeof proxyApprovalSchema>;
