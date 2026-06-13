import { axiosClient } from '@/shared/plugins/axiosClient';
import type {
  GetSpecimenHistoryResponse,
  GetSpecimenSetsResponse,
  ConfirmSpecimenOrdersResponse,
  GetSpecimenItemsResponse,
} from '@/front_bff_shared/features/order/specimen-order/specimen-orders/types/responses/specimen-orders.response';
import type { ConfirmSpecimenOrdersRequest } from '@/front_bff_shared/features/order/specimen-order/specimen-orders/types/requests/specimen-orders.request';

export async function getSpecimenHistory(patientId: string): Promise<GetSpecimenHistoryResponse> {
  const response = await axiosClient.get<GetSpecimenHistoryResponse>(
    `/patients/${patientId}/specimen-history`
  );
  return response.data;
}

export async function getSpecimenSets(
  setType: 'hospital' | 'department' | 'my' | 'regular' = 'hospital'
): Promise<GetSpecimenSetsResponse> {
  const response = await axiosClient.get<GetSpecimenSetsResponse>(
    '/order-sets/specimen-sets',
    { params: { setType } }
  );
  return response.data;
}

export async function getSpecimenItems(): Promise<GetSpecimenItemsResponse> {
  const response = await axiosClient.get<GetSpecimenItemsResponse>('/master/specimen-items');
  return response.data;
}

export async function confirmSpecimenOrders(
  patientId: string,
  request: ConfirmSpecimenOrdersRequest
): Promise<ConfirmSpecimenOrdersResponse> {
  const response = await axiosClient.post<ConfirmSpecimenOrdersResponse>(
    `/patients/${patientId}/specimen-orders`,
    request
  );
  return response.data;
}
