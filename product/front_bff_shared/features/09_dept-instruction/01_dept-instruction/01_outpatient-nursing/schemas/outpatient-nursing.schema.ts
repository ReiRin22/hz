/**
 * outpatientNursing Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const outpatientNursingSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type OutpatientNursingSchemaType = z.infer<typeof outpatientNursingSchema>;
