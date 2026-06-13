import { Injectable } from '@nestjs/common';
import { GuidanceIntegrationClient } from './guidance-integration.client';

@Injectable()
export class GuidanceIntegrationService {
  constructor(private readonly guidanceIntegrationClient: GuidanceIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
