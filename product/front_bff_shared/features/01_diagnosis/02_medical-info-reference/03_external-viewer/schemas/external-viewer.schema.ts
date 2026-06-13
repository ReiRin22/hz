/**
 * externalViewer Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const externalViewerSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ExternalViewerSchemaType = z.infer<typeof externalViewerSchema>;
