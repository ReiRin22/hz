import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';
import { SsoClient } from './sso.client';

@Module({
  imports: [HttpModule],
  controllers: [SsoController],
  providers: [SsoService, SsoClient],
})
export class SsoModule {}
