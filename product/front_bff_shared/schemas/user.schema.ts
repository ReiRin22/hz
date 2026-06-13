import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください").max(10, "10文字以内で入力してください"),
  email: z.string().email("有効なメールアドレス形式で入力してください"),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;