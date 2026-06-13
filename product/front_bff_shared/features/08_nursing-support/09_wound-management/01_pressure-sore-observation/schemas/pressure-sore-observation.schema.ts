/**
 * pressureSoreObservation Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pressureSoreObservationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PressureSoreObservationSchemaType = z.infer<typeof pressureSoreObservationSchema>;
