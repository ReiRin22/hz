import type { PatientSearchRequest } from '@/front_bff_shared/features/karte/patientInfo/types/requests/patient.request';
import type { PatientSearchResultResponse } from '@/front_bff_shared/features/karte/patientHeader/types/responses/patient-header.response';
import { classifyHttpError } from '@/shared/utils/bff-error';

// この関数は Client Component（usePatientHeader）からのみ呼び出す。Server Component から直接呼ばないこと。
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

/**
 * 患者検索
 * @param params 検索パラメータ（query: 検索キーワード、limit: 取得件数上限）
 * @param signal AbortController のシグナル（オプション）
 */
export async function searchPatients(
  params: PatientSearchRequest,
  signal?: AbortSignal
): Promise<PatientSearchResultResponse> {
  const searchParams = new URLSearchParams({ query: params.query });
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const res = await fetch(
    `${BFF_BASE_URL}/bff/patients/search?${searchParams.toString()}`,
    {
      cache: 'no-store',
      signal,
    }
  );
  if (!res.ok) {
    throw classifyHttpError(res.status);
  }
  return res.json() as Promise<PatientSearchResultResponse>;
}
