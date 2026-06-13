import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthClient } from './auth.client';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthClient],
  exports: [AuthService],
})
export class AuthModule {}
