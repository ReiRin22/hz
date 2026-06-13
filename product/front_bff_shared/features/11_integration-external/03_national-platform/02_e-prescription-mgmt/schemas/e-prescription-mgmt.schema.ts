/**
 * ePrescriptionMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const ePrescriptionMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type EPrescriptionMgmtSchemaType = z.infer<typeof ePrescriptionMgmtSchema>;
