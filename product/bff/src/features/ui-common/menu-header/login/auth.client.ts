import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { UpstreamLoginResponse } from './types/auth.type';
import type { LoginRequest } from '@/front_bff_shared/features/ui-common/menu-header/login/types/requests/auth.request';

@Injectable()
export class AuthClient {
  async login(request: LoginRequest): Promise<UpstreamLoginResponse> {
    const response = await axiosClient.post<UpstreamLoginResponse>('/auth/login', {
      userId: request.userId,
      password: request.password,
    });
    return response.data;
  }
}
