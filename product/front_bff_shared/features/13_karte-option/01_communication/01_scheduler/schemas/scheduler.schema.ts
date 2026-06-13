/**
 * scheduler Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const schedulerSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SchedulerSchemaType = z.infer<typeof schedulerSchema>;
