import { Injectable } from '@nestjs/common';
import { ProxyOrderClient } from './proxy-order.client';

@Injectable()
export class ProxyOrderService {
  constructor(private readonly proxyOrderClient: ProxyOrderClient) {}

  // TODO: ビジネスロジックを実装
}
