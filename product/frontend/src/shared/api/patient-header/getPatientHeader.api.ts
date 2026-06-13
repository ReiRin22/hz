import type { GetPatientHeaderResponse, PatientHeaderResponse } from '@/front_bff_shared/features/karte/patientHeader/types/responses/patient-header.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

// この関数は Client Component（usePatientHeader）からのみ呼び出す。Server Component から直接呼ばないこと。
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

/**
 * 患者ヘッダー情報を取得する
 * @param patientId 患者ID
 * @param signal AbortController のシグナル（オプション）
 */
export async function getPatientHeader(
  patientId: string,
  signal?: AbortSignal
): Promise<PatientHeaderResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/patients/${encodeURIComponent(patientId)}/header`,
    {
      cache: 'no-store',
      signal,
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
  const data = await res.json() as GetPatientHeaderResponse;
  return data.patientHeader;
}
