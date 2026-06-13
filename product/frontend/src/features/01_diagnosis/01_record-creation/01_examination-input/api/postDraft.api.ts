import type { PostMedicalRecordRequest } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';
import type { PostMedicalRecordDraftResponse } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function postDraft(
  patientId: string,
  body: PostMedicalRecordRequest
): Promise<PostMedicalRecordDraftResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/records/${encodeURIComponent(patientId)}/soap/draft`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
  return res.json() as Promise<PostMedicalRecordDraftResponse>;
}
