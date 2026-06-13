/**
 * onlineEligibility Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const onlineEligibilitySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OnlineEligibilitySchemaType = z.infer<typeof onlineEligibilitySchema>;
