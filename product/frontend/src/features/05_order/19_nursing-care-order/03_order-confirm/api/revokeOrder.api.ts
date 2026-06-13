import { axiosClient } from '@/shared/plugins/axiosClient';
import type { RevokeOrderRequest } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/requests/orderConfirmation.request';
import type { RevokeOrderResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function revokeOrder(
  orderId: string,
  request: RevokeOrderRequest,
): Promise<RevokeOrderResponse> {
  const response = await axiosClient.post<RevokeOrderResponse>(
    `/orders/${orderId}/revoke`,
    request,
  );
  return response.data;
}
