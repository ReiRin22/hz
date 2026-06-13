/**
 * surgeryTransfusion Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const surgeryTransfusionSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type SurgeryTransfusionSchemaType = z.infer<typeof surgeryTransfusionSchema>;
