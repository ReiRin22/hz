// shared/validators/test-results/test-result.schema.ts
// 検査結果入力バリデーションスキーマ（Zod）
// 設計書: docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/14.状態管理設計.md
// バリデーションコード: E001-E003（仕様書 RES002 準拠）
import { z } from 'zod';

// E001: 数値チェック
// E002: 小数点桁数チェック（decimalPlaces は呼び出し元が渡す）
// E003: 下限・上限チェック
export const resultValueSchema = z
  .string()
  .refine(
    (v) => v === '' || /^-?\d*\.?\d+$/.test(v.trim()),
    { message: '結果値は数値で入力してください', params: { code: 'E001' } }
  );

export const resultValueWithDecimalSchema = (decimalPlaces: number) =>
  resultValueSchema.refine(
    (v) => {
      if (v === '') return true;
      const dotIndex = v.indexOf('.');
      if (dotIndex === -1) return true;
      return v.length - dotIndex - 1 <= decimalPlaces;
    },
    {
      message: `小数点以下は${decimalPlaces}桁以内で入力してください`,
      params: { code: 'E001' }
    }
  );

export const testResultRowSchema = z
  .object({
    resultValue: z.string(),
    decimalPlaces: z.number().nonnegative(),
    lowerLimit: z.string().optional(),
    upperLimit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // E001 + E002
    const valueErr = resultValueWithDecimalSchema(data.decimalPlaces).safeParse(data.resultValue);
    if (!valueErr.success) {
      valueErr.error.issues.forEach((issue) =>
        ctx.addIssue({ ...issue, path: ['resultValue'] })
      );
    }

    // E003: 下限 > 上限
    if (data.lowerLimit && data.upperLimit) {
      const lower = parseFloat(data.lowerLimit);
      const upper = parseFloat(data.upperLimit);
      if (!isNaN(lower) && !isNaN(upper) && lower > upper) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '基準値の下限が上限を超えています',
          path: ['lowerLimit'],
          params: { code: 'E003' },
        });
      }
    }
  });

export type TestResultRowInput = z.infer<typeof testResultRowSchema>;
