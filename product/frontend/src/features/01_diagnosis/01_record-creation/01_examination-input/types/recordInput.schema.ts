import { z } from 'zod';

/** E001: 未来日禁止。E002: 禁則文字（<>）禁止 */
export const recordInputSchema = z.object({
  recordDate: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return !isNaN(date.getTime()) && date <= today;
      },
      { message: '記載日は未来日を指定できません。正しい日付を入力してください。' },
    ),
  soapContent: z
    .string()
    .refine(
      (val) => !/[<>]/.test(val),
      { message: '診療記録本文に不正な文字が含まれています。＜＞などの特殊文字は使用できません。' },
    ),
});

export type RecordInputFormValues = z.infer<typeof recordInputSchema>;
