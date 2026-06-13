import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function deleteDraft(params: {
  patientId: string;
  draftId: string;
}): Promise<void> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/records/${encodeURIComponent(params.patientId)}/soap/draft/${encodeURIComponent(params.draftId)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
}
