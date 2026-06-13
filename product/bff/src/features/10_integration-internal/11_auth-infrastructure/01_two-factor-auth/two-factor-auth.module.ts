import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthClient } from './two-factor-auth.client';

@Module({
  imports: [HttpModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, TwoFactorAuthClient],
})
export class TwoFactorAuthModule {}
