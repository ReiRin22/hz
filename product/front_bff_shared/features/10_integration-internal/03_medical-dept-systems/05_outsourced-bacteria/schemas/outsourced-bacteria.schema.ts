/**
 * outsourcedBacteria Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const outsourcedBacteriaSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OutsourcedBacteriaSchemaType = z.infer<typeof outsourcedBacteriaSchema>;
