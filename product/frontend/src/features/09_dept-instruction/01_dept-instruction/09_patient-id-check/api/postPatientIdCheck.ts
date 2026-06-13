'use client';

import { axiosClient } from '@/shared/plugins/axiosClient';
import type { PostPatientIdCheckCompleteRequest } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/requests/patientIdCheck.request';
import type { PostPatientIdCheckCompleteResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

export async function postPatientIdCheck(
  orderId: string,
  request: Omit<PostPatientIdCheckCompleteRequest, 'orderId'>,
): Promise<PostPatientIdCheckCompleteResponse> {
  const response = await axiosClient.post<PostPatientIdCheckCompleteResponse>(
    `/dept-instructions/${orderId}/patient-id-check/complete`,
    request,
  );
  return response.data;
}
