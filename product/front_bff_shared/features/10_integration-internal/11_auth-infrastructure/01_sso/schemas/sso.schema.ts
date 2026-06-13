/**
 * sso Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const ssoSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SsoSchemaType = z.infer<typeof ssoSchema>;
