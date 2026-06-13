/**
 * monitoringSystem Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const monitoringSystemSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type MonitoringSystemSchemaType = z.infer<typeof monitoringSystemSchema>;
