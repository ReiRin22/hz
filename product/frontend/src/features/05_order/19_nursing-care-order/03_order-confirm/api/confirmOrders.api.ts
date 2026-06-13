import { axiosClient } from '@/shared/plugins/axiosClient';
import type { ConfirmOrdersRequest } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/requests/orderConfirmation.request';
import type { ConfirmOrdersResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function confirmOrders(request: ConfirmOrdersRequest): Promise<ConfirmOrdersResponse> {
  const response = await axiosClient.post<ConfirmOrdersResponse>('/orders/confirm', request);
  return response.data;
}
