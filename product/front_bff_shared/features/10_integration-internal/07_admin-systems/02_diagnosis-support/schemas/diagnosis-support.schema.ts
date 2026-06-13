/**
 * diagnosisSupport Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const diagnosisSupportSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type DiagnosisSupportSchemaType = z.infer<typeof diagnosisSupportSchema>;
