/**
 * transferOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const transferOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type TransferOutputSchemaType = z.infer<typeof transferOutputSchema>;
