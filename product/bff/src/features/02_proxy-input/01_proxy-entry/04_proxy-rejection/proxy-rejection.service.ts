import { Injectable } from '@nestjs/common';
import { ProxyRejectionClient } from './proxy-rejection.client';

@Injectable()
export class ProxyRejectionService {
  constructor(private readonly proxyRejectionClient: ProxyRejectionClient) {}

  // TODO: ビジネスロジックを実装
}
