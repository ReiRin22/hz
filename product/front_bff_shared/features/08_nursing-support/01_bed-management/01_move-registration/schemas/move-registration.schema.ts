/**
 * moveRegistration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const moveRegistrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MoveRegistrationSchemaType = z.infer<typeof moveRegistrationSchema>;
