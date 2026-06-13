import type {
  GetOrderSetsRequest,
  OrderSetResponse,
} from '@/front_bff_shared/features/orders/orderEntry/types/orderEntry.types';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getOrderSets(
  params: GetOrderSetsRequest,
  signal?: AbortSignal
): Promise<OrderSetResponse> {
  const res = await fetch(`${BFF_BASE_URL}/api/orders/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    cache: 'no-store',
    signal,
  });
  if (!res.ok) throw classifyHttpError(res.status);
  return res.json() as Promise<OrderSetResponse>;
}
