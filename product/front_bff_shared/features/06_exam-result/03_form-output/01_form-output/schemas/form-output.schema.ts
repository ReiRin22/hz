/**
 * formOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const formOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type FormOutputSchemaType = z.infer<typeof formOutputSchema>;
