/**
 * pacs Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const pacsSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type PacsSchemaType = z.infer<typeof pacsSchema>;
