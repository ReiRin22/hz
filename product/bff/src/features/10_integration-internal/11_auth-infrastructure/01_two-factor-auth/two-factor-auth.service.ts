import { Injectable } from '@nestjs/common';
import { TwoFactorAuthClient } from './two-factor-auth.client';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly twoFactorAuthClient: TwoFactorAuthClient) {}

  // TODO: ビジネスロジックを実装
}
