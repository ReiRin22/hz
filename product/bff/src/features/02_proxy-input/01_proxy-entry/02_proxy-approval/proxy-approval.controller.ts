import { Controller } from '@nestjs/common';
import { ProxyApprovalService } from './proxy-approval.service';

@Controller('proxy-approval')
export class ProxyApprovalController {
  constructor(private readonly proxyApprovalService: ProxyApprovalService) {}

  // TODO: エンドポイントを実装
}
