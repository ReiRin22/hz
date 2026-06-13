'use client';

import { axiosClient } from '@/shared/plugins/axiosClient';
import type { PostPatientConfirmReasonRequest } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/requests/patientIdCheck.request';
import type { PostPatientConfirmReasonResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

export async function postPatientConfirmReason(
  orderId: string,
  request: Omit<PostPatientConfirmReasonRequest, 'orderId'>,
): Promise<PostPatientConfirmReasonResponse> {
  const response = await axiosClient.post<PostPatientConfirmReasonResponse>(
    `/dept-instructions/${orderId}/patient-id-check/confirm-reason`,
    request,
  );
  return response.data;
}
