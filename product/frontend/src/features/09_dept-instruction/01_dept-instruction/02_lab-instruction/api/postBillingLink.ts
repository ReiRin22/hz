import { axiosClient } from '@/shared/plugins/axiosClient';
import type { PostBillingLinkRequest } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/requests/deptInstruction.request';
import type { PostBillingLinkResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

export async function postBillingLink(
  orderId: string,
  request: Omit<PostBillingLinkRequest, 'orderId'>,
): Promise<PostBillingLinkResponse> {
  const response = await axiosClient.post<PostBillingLinkResponse>(
    `/dept-instructions/${orderId}/billing-link`,
    request,
  );
  return response.data;
}
