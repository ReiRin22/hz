'use client';

import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetPatientIdCheckExpectationsResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

export async function getPatientIdCheckExpectations(
  orderId: string,
): Promise<GetPatientIdCheckExpectationsResponse> {
  const response = await axiosClient.get<GetPatientIdCheckExpectationsResponse>(
    `/dept-instructions/${orderId}/patient-id-check/expectations`,
  );
  return response.data;
}
