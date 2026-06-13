/**
 * attendanceSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const attendanceSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AttendanceSystemSchemaType = z.infer<typeof attendanceSystemSchema>;
