/**
 * fileAttachment Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const fileAttachmentSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type FileAttachmentSchemaType = z.infer<typeof fileAttachmentSchema>;
