import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyRejectionController } from './proxy-rejection.controller';
import { ProxyRejectionService } from './proxy-rejection.service';
import { ProxyRejectionClient } from './proxy-rejection.client';

@Module({
  imports: [HttpModule],
  controllers: [ProxyRejectionController],
  providers: [ProxyRejectionService, ProxyRejectionClient],
})
export class ProxyRejectionModule {}
