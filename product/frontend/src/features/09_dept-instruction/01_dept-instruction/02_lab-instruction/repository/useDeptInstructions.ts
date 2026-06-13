import { getDeptInstructions } from '../api/getDeptInstructions';
import type { GetDeptInstructionsRequest } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';
import type { GetDeptInstructionsResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

export async function fetchDeptInstructions(
  params: GetDeptInstructionsRequest,
): Promise<GetDeptInstructionsResponse> {
  return getDeptInstructions(params);
}
