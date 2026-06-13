/**
 * bedPeriodMgmt Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const bedPeriodMgmtSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type BedPeriodMgmtSchemaType = z.infer<typeof bedPeriodMgmtSchema>;
