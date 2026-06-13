import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequest } from '@/front_bff_shared/features/ui-common/menu-header/login/types/requests/auth.request';
import type { LoginResponse } from '@/front_bff_shared/features/ui-common/menu-header/login/types/responses/auth.response';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(body);
  }
}
