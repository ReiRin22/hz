/**
 * imagingOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const imagingOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ImagingOutputSchemaType = z.infer<typeof imagingOutputSchema>;
