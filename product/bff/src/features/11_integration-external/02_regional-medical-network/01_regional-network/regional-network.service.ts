import { Injectable } from '@nestjs/common';
import { RegionalNetworkClient } from './regional-network.client';

@Injectable()
export class RegionalNetworkService {
  constructor(private readonly regionalNetworkClient: RegionalNetworkClient) {}

  // TODO: ビジネスロジックを実装
}
