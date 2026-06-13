import type {
  PostOrderEntryRequest,
  PostOrderEntryResponse,
  SaveTemporaryOrderRequest,
  SaveTemporaryOrderResponse,
} from '@/front_bff_shared/features/orders/orderEntry/types/orderEntry.types';
import { classifyHttpError } from '@/shared/utils/bff-error';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function postOrderEntry(
  body: PostOrderEntryRequest
): Promise<PostOrderEntryResponse> {
  const res = await fetch(`${BFF_BASE_URL}/api/orders/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw classifyHttpError(res.status);
  return res.json() as Promise<PostOrderEntryResponse>;
}

export async function saveTemporaryOrder(
  body: SaveTemporaryOrderRequest
): Promise<SaveTemporaryOrderResponse> {
  const res = await fetch(`${BFF_BASE_URL}/api/orders/temporary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw classifyHttpError(res.status);
  return res.json() as Promise<SaveTemporaryOrderResponse>;
}
