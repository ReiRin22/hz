import { Injectable } from '@nestjs/common';
import { ProxyInputClient } from './proxy-input.client';

@Injectable()
export class ProxyInputService {
  constructor(private readonly proxyInputClient: ProxyInputClient) {}

  // TODO: ビジネスロジックを実装
}
