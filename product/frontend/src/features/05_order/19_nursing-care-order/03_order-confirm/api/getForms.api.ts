import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetMedicalFormsRequest } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/requests/orderConfirmation.request';
import type { GetMedicalFormsResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function getForms(request: GetMedicalFormsRequest): Promise<GetMedicalFormsResponse> {
  const response = await axiosClient.post<GetMedicalFormsResponse>('/orders/forms', request);
  return response.data;
}
