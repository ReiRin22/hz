/**
 * nursingDatabase Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingDatabaseSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingDatabaseSchemaType = z.infer<typeof nursingDatabaseSchema>;
