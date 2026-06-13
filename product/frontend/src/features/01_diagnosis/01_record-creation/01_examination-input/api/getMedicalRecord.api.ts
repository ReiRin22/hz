import type { GetMedicalRecordResponse } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getMedicalRecord(params: {
  patientId: string;
  recordId: string;
}): Promise<GetMedicalRecordResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/records/${encodeURIComponent(params.patientId)}/soap/${encodeURIComponent(params.recordId)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
  return res.json() as Promise<GetMedicalRecordResponse>;
}
