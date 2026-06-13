import { updateDeptInstructionStatus } from '../api/updateDeptInstructionStatus';
import { postImplementer } from '../api/postImplementer';
import { postBillingLink } from '../api/postBillingLink';
import type { UpdateDeptInstructionStatusResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';
import type {
  PostImplementerRequest,
  PostBillingLinkRequest,
} from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';

export async function executeStatusUpdate(params: {
  orderId: string;
  newStatus: string;
  updatedBy: string;
  timestamp: string;
}): Promise<UpdateDeptInstructionStatusResponse> {
  return updateDeptInstructionStatus(params.orderId, {
    newStatus: params.newStatus,
    updatedBy: params.updatedBy,
    timestamp: params.timestamp,
  });
}

export async function executeImplementer(
  orderId: string,
  request: Omit<PostImplementerRequest, 'orderId'>,
) {
  return postImplementer(orderId, request);
}

export async function executeBillingLink(
  orderId: string,
  request: Omit<PostBillingLinkRequest, 'orderId'>,
) {
  return postBillingLink(orderId, request);
}
