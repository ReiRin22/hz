import { axiosClient } from '@/shared/plugins/axiosClient';
import type { OutputMedicalFormsRequest } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/requests/orderConfirmation.request';
import type { OutputMedicalFormsResponse } from '@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response';

export async function outputForms(
  request: OutputMedicalFormsRequest,
): Promise<OutputMedicalFormsResponse> {
  const response = await axiosClient.post<OutputMedicalFormsResponse>(
    '/orders/forms/output',
    request,
  );
  return response.data;
}
