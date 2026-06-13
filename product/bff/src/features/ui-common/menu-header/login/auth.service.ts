import { Injectable, Inject, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { AuthClient } from './auth.client';
import type { LoginRequest } from '@/front_bff_shared/features/ui-common/menu-header/login/types/requests/auth.request';
import type { LoginResponse } from '@/front_bff_shared/features/ui-common/menu-header/login/types/responses/auth.response';

@Injectable()
export class AuthService {
  constructor(@Inject(AuthClient) private readonly authClient: AuthClient) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const upstream = await this.authClient.login(request);
      return {
        userId: upstream.userId,
        userName: upstream.userName,
        role: upstream.role,
        token: upstream.token,
      };
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        throw new UnauthorizedException({ errorCode: 'E004', message: 'ユーザーIDまたはパスワードが正しくありません。' });
      }
      throw new InternalServerErrorException({ errorCode: 'E500', message: 'システムエラーが発生しました。しばらくしてから再試行してください。' });
    }
  }
}
