import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetOrdersRequest } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/requests/orderConfirmation.request';
import type { GetOrdersResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function getOrders(request: GetOrdersRequest): Promise<GetOrdersResponse> {
  const response = await axiosClient.post<GetOrdersResponse>('/orders', request);
  return response.data;
}
