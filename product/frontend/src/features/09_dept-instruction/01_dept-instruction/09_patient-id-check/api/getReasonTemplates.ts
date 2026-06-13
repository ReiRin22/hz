'use client';

import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetReasonTemplatesResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

export async function getReasonTemplates(): Promise<GetReasonTemplatesResponse> {
  const response = await axiosClient.get<GetReasonTemplatesResponse>(
    '/dept-instructions/patient-id-check/reason-templates',
  );
  return response.data;
}
