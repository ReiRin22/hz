import { z } from 'zod';

export const postMedicalRecordSchema = z.object({
  status: z.enum(['CONFIRMED', 'DRAFT']),
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください'),
  recorderId: z.string().min(1, '記載者を選択してください'),
  soapContent: z.string().max(5000, '5000文字以内で入力してください'),
  receptionId: z.string().min(1, '受付IDは必須です'),
});

export const putMedicalRecordSchema = z.object({
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください'),
  recorderId: z.string().min(1, '記載者を選択してください'),
  soapContent: z.string().max(5000, '5000文字以内で入力してください'),
});

export const postCommentSchema = z.object({
  content: z.string().min(1, 'コメント内容を入力してください').max(200, '200文字以内で入力してください'),
});

export const putCommentSchema = z.object({
  content: z.string().min(1, 'コメント内容を入力してください').max(200, '200文字以内で入力してください'),
});

export type PostMedicalRecordInput = z.infer<typeof postMedicalRecordSchema>;
export type PutMedicalRecordInput = z.infer<typeof putMedicalRecordSchema>;
export type PostCommentInput = z.infer<typeof postCommentSchema>;
export type PutCommentInput = z.infer<typeof putCommentSchema>;
