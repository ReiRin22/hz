/**
 * contraindicationCheck Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const contraindicationCheckSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ContraindicationCheckSchemaType = z.infer<typeof contraindicationCheckSchema>;
