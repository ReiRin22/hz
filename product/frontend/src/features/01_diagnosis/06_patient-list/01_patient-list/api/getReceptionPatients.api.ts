import type { GetReceptionPatientsResponse } from '@/front_bff_shared/features/reception/receptionPatientList/types/responses/receptionPatientList.response';

// この関数は Client Component（useReceptionPatients）からのみ呼び出す。Server Component から直接呼ばないこと。
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getReceptionPatients(
  date: string,
  signal?: AbortSignal
): Promise<GetReceptionPatientsResponse> {
  const res = await fetch(`${BFF_BASE_URL}/bff/reception-patients?date=${date}`, {
    cache: 'no-store',
    signal,
  });
  if (!res.ok) throw new Error(`BFF fetch failed: ${res.status}`);
  return res.json() as Promise<GetReceptionPatientsResponse>;
}
