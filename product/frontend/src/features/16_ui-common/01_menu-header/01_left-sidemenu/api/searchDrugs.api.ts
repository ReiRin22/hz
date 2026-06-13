import type {
  SearchDrugsRequest,
  DrugSearchResponse,
} from '@/front_bff_shared/features/orders/orderEntry/types/orderEntry.types';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function searchDrugs(
  params: SearchDrugsRequest,
  signal?: AbortSignal
): Promise<DrugSearchResponse> {
  const searchParams = new URLSearchParams({ query: params.query });
  if (params.orderType) searchParams.set('orderType', params.orderType);
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));

  const res = await fetch(
    `${BFF_BASE_URL}/api/orders/drugs/search?${searchParams.toString()}`,
    { cache: 'no-store', signal }
  );
  if (!res.ok) throw classifyHttpError(res.status);
  return res.json() as Promise<DrugSearchResponse>;
}
