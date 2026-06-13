import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';


// #セレナ使えてる？
export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/comments/my/${encodeURIComponent(commentId)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
}
