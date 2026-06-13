/**
 * admissionTransfer Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const admissionTransferSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type AdmissionTransferSchemaType = z.infer<typeof admissionTransferSchema>;
