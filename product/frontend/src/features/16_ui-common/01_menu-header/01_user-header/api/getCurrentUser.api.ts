import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetCurrentUserResponse } from '@/../front_bff_shared/features/current-user/types/response/current-user.api.response';

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const response = await axiosClient.get<GetCurrentUserResponse>('/current-user');
  return response.data;
}
