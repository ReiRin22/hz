import type { PutMedicalRecordRequest } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';
import type { PutMedicalRecordResponse } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function putMedicalRecord(
  patientId: string,
  recordId: string,
  body: PutMedicalRecordRequest,
  correlationId: string
): Promise<PutMedicalRecordResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/records/${encodeURIComponent(patientId)}/soap/${encodeURIComponent(recordId)}`,
    {
      method: 'PUT',
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
  return res.json() as Promise<PutMedicalRecordResponse>;
}
