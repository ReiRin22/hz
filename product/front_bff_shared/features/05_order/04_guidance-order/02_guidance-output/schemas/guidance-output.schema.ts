/**
 * guidanceOutput Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const guidanceOutputSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type GuidanceOutputSchemaType = z.infer<typeof guidanceOutputSchema>;
