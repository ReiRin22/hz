/**
 * examReservation Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const examReservationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ExamReservationSchemaType = z.infer<typeof examReservationSchema>;
