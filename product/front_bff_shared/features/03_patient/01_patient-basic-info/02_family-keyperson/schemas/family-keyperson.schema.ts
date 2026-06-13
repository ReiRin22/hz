/**
 * familyKeyperson Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const familyKeypersonSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type FamilyKeypersonSchemaType = z.infer<typeof familyKeypersonSchema>;
