import { axiosClient } from '@/shared/plugins/axiosClient';
import type { UpdateDeptInstructionStatusRequest } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';
import type { UpdateDeptInstructionStatusResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

export async function updateDeptInstructionStatus(
  orderId: string,
  request: Omit<UpdateDeptInstructionStatusRequest, 'orderId'>,
): Promise<UpdateDeptInstructionStatusResponse> {
  const response = await axiosClient.patch<UpdateDeptInstructionStatusResponse>(
    `/dept-instructions/${orderId}/status`,
    request,
  );
  return response.data;
}
