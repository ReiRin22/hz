import { Injectable } from '@nestjs/common';
import { ProxyApprovalClient } from './proxy-approval.client';

@Injectable()
export class ProxyApprovalService {
  constructor(private readonly proxyApprovalClient: ProxyApprovalClient) {}

  // TODO: ビジネスロジックを実装
}
