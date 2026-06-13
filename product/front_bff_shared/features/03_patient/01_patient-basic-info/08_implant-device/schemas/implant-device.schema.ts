/**
 * implantDevice Zod スキーマ定義
 * フロントエンド・BFF 共通バリデーション
 */

import { z } from 'zod';

export const implantDeviceSchema = z.object({
  // TODO: バリデーションスキーマを定義
});

export type ImplantDeviceSchemaType = z.infer<typeof implantDeviceSchema>;
