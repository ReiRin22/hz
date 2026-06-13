import { z } from 'zod';

export const temporarySaveSchema = z.object({
  saveName: z.string().min(1, '保存名を入力してください').max(50, '50文字以内で入力してください'),
});

export type TemporarySaveFormValues = z.infer<typeof temporarySaveSchema>;
