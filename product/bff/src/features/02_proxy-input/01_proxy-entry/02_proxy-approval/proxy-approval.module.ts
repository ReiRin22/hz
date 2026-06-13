import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyApprovalController } from './proxy-approval.controller';
import { ProxyApprovalService } from './proxy-approval.service';
import { ProxyApprovalClient } from './proxy-approval.client';

@Module({
  imports: [HttpModule],
  controllers: [ProxyApprovalController],
  providers: [ProxyApprovalService, ProxyApprovalClient],
})
export class ProxyApprovalModule {}
