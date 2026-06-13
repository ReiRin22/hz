/**
 * imagingCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const imagingCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ImagingCheckSchemaType = z.infer<typeof imagingCheckSchema>;
