/**
 * regionalNetwork Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const regionalNetworkSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type RegionalNetworkSchemaType = z.infer<typeof regionalNetworkSchema>;
