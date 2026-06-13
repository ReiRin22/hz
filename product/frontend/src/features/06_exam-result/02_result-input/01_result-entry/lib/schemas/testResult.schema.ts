/**
 * 検査結果入力 Zod スキーマ定義
 * 設計書: docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/14.状態管理設計.md
 *
 * バリデーションコード（仕様書 RES002 準拠）:
 *   E001: 結果値は数値
 *   E002: 小数点桁数チェック
 *   E003: 下限 <= 上限
 *   E005: 修正理由 選択必須
 *   E006: 理由「その他」選択時はテキスト必須
 */
import { z } from 'zod';

// ---- プリミティブスキーマ ----------------------------------------

/** E001: 結果値は空または数値形式 */
export const resultValueSchema = z
  .string()
  .refine(
    (v) => v === '' || /^-?\d*\.?\d+$/.test(v.trim()),
    { message: '結果値は数値で入力してください' }
  );

/** E002: 小数点桁数チェック（decimalPlaces を動的に受け取る） */
export const resultValueWithDecimalSchema = (decimalPlaces: number) =>
  resultValueSchema.refine(
    (v) => {
      if (v === '') return true;
      const dot = v.indexOf('.');
      if (dot === -1) return true;
      return v.length - dot - 1 <= decimalPlaces;
    },
    { message: `小数点以下は${decimalPlaces}桁以内で入力してください` }
  );

// ---- 行単位スキーマ（E001 + E002 + E003） ----------------------

export const testResultRowSchema = z
  .object({
    resultValue: z.string(),
    decimalPlaces: z.number().nonnegative(),
    lowerLimit: z.string().optional(),
    upperLimit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // E001 + E002
    const valueResult = resultValueWithDecimalSchema(data.decimalPlaces).safeParse(data.resultValue);
    if (!valueResult.success) {
      valueResult.error.issues.forEach((issue) =>
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
        });
      }
    }
  });

// ---- 修正理由スキーマ（E005 + E006） ---------------------------

export const correctionReasonSchema = z
  .object({
    reason: z.string().min(1, '修正理由を選択してください'),  // E005
    otherText: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // E006: 「その他」選択時はテキスト必須
    if (data.reason === 'other' && (!data.otherText || data.otherText.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '理由を入力してください',
        path: ['otherText'],
      });
    }
  });

// ---- 新規行追加スキーマ -----------------------------------------

export const addTestResultSchema = z.object({
  itemCode: z.string().min(1, '検査コードを選択してください'),
  itemName: z.string().min(1, '検査項目名を選択してください'),
  resultValue: z.string(),
  unit: z.string(),
});

// ---- 型推論 -----------------------------------------------------

export type TestResultRowInput = z.infer<typeof testResultRowSchema>;
export type CorrectionReasonInput = z.infer<typeof correctionReasonSchema>;
export type AddTestResultInput = z.infer<typeof addTestResultSchema>;
