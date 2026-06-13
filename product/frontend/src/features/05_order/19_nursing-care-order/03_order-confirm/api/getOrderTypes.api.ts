import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetOrderTypesResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function getOrderTypes(): Promise<GetOrderTypesResponse> {
  const response = await axiosClient.get<GetOrderTypesResponse>('/order-types');
  return response.data;
}
