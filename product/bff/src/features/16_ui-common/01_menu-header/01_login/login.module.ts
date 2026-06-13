import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginClient } from './login.client';

@Module({
  imports: [HttpModule],
  controllers: [LoginController],
  providers: [LoginService, LoginClient],
})
export class LoginModule {}
