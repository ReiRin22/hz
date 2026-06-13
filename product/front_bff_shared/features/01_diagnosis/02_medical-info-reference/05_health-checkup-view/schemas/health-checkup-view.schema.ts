/**
 * healthCheckupView Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const healthCheckupViewSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type HealthCheckupViewSchemaType = z.infer<typeof healthCheckupViewSchema>;
