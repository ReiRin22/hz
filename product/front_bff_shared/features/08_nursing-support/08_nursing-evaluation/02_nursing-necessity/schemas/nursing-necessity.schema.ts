/**
 * nursingNecessity Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingNecessitySchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingNecessitySchemaType = z.infer<typeof nursingNecessitySchema>;
