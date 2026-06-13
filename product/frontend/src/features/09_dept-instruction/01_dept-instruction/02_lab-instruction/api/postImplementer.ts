import { axiosClient } from '@/shared/plugins/axiosClient';
import type { PostImplementerRequest } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';
import type { PostImplementerResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

export async function postImplementer(
  orderId: string,
  request: Omit<PostImplementerRequest, 'orderId'>,
): Promise<PostImplementerResponse> {
  const response = await axiosClient.post<PostImplementerResponse>(
    `/dept-instructions/${orderId}/implementer`,
    request,
  );
  return response.data;
}
