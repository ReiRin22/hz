/**
 * surgerySystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const surgerySystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SurgerySystemSchemaType = z.infer<typeof surgerySystemSchema>;
