/**
 * nursingDocument Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const nursingDocumentSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type NursingDocumentSchemaType = z.infer<typeof nursingDocumentSchema>;
