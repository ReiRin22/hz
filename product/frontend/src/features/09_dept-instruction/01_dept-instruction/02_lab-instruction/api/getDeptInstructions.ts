import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetDeptInstructionsRequest } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';
import type { GetDeptInstructionsResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

export async function getDeptInstructions(
  request: GetDeptInstructionsRequest,
): Promise<GetDeptInstructionsResponse> {
  const response = await axiosClient.post<GetDeptInstructionsResponse>('/dept-instructions', request);
  return response.data;
}
