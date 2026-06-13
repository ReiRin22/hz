/**
 * imagingIntegration Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const imagingIntegrationSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ImagingIntegrationSchemaType = z.infer<typeof imagingIntegrationSchema>;
