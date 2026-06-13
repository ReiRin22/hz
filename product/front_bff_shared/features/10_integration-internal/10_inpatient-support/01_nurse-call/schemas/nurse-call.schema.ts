/**
 * nurseCall Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nurseCallSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NurseCallSchemaType = z.infer<typeof nurseCallSchema>;
