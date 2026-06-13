import type { PostMedicalRecordRequest } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';
import type {
  PostMedicalRecordConfirmedResponse,
  PostMedicalRecordDraftResponse,
} from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function postMedicalRecord(
  patientId: string,
  body: PostMedicalRecordRequest,
  correlationId: string
): Promise<PostMedicalRecordConfirmedResponse | PostMedicalRecordDraftResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/records/${encodeURIComponent(patientId)}/soap`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
  return res.json() as Promise<PostMedicalRecordConfirmedResponse | PostMedicalRecordDraftResponse>;
}
