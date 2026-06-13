/**
 * twoFactorAuth Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const twoFactorAuthSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TwoFactorAuthSchemaType = z.infer<typeof twoFactorAuthSchema>;
