/**
 * receivedDocument Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const receivedDocumentSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ReceivedDocumentSchemaType = z.infer<typeof receivedDocumentSchema>;
