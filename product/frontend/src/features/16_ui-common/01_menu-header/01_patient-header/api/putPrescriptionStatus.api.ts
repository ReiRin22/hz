import type { PrescriptionStatusUpdateRequest } from '@/front_bff_shared/types/request/patient.request.type';
import { classifyHttpError } from '@/shared/utils/bff-error';

// この関数は Client Component（usePatientHeader）からのみ呼び出す。Server Component から直接呼ばないこと。
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

/**
 * 処方箋発行形態を変更する
 * @param body 変更リクエスト（patientId, status）
 */
export async function putPrescriptionStatus(
  body: PrescriptionStatusUpdateRequest
): Promise<void> {
  const res = await fetch(
    `${BFF_BASE_URL}/api/patients/${encodeURIComponent(body.patientId)}/prescription-status`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body.status }),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
}
