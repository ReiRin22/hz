import { z } from 'zod';

const TestResultSaveItemSchema = z.object({
  itemCode: z.string(),
  resultValue: z.number(),
  unit: z.string(),
  lowerLimit: z.number().optional(),
  upperLimit: z.number().optional(),
  testDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const ModificationReasonInputSchema = z.object({
  reasonCode: z.string(),
  reasonText: z.string().min(1).optional(), // 空文字不可（OTHER 選択時の必須入力意味を持つ）
});

export const TestResultSaveRequestSchema = z
  .object({
    testResults: z.array(TestResultSaveItemSchema),
    modificationReason: ModificationReasonInputSchema.optional(),
  })
  .superRefine((val, ctx) => {
    const reason = val.modificationReason;
    if (reason?.reasonCode === 'OTHER' && !reason.reasonText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['modificationReason', 'reasonText'],
        message: 'reasonCode が OTHER の場合 reasonText は必須です',
      });
    }
  });

