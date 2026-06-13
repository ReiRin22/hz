/**
 * calendar Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const calendarSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type CalendarSchemaType = z.infer<typeof calendarSchema>;
