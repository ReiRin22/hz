/**
 * acpInfo Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const acpInfoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AcpInfoSchemaType = z.infer<typeof acpInfoSchema>;
