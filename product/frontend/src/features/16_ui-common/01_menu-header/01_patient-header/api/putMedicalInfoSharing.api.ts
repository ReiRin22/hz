import type { MedicalInfoSharingUpdateRequest } from '@/front_bff_shared/types/request/patient.request.type';
import { classifyHttpError } from '@/shared/utils/bff-error';

// この関数は Client Component（usePatientHeader）からのみ呼び出す。Server Component から直接呼ばないこと。
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

/**
 * 医療情報共有設定を変更する
 * @param body 変更リクエスト（patientId, status, expiryDate, details）
 */
export async function putMedicalInfoSharing(
  body: MedicalInfoSharingUpdateRequest
): Promise<void> {
  const { patientId, ...requestBody } = body;
  const res = await fetch(
    `${BFF_BASE_URL}/api/patients/${encodeURIComponent(patientId)}/medical-info-sharing`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
}
