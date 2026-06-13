/**
 * bedExitDetection Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const bedExitDetectionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type BedExitDetectionSchemaType = z.infer<typeof bedExitDetectionSchema>;
