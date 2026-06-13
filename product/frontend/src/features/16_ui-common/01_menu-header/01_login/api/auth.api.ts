import { axiosClient } from '@/shared/plugins/axiosClient';
import type { LoginRequest } from '@/front_bff_shared/features/ui-common/menu-header/login/types/requests/auth.request';
import type { LoginResponse } from '@/front_bff_shared/features/ui-common/menu-header/login/types/responses/auth.response';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await axiosClient.post<LoginResponse>('/auth/login', request);
  return response.data;
}
