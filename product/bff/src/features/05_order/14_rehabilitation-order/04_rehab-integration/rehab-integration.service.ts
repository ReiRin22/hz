import { Injectable } from '@nestjs/common';
import { RehabIntegrationClient } from './rehab-integration.client';

@Injectable()
export class RehabIntegrationService {
  constructor(private readonly rehabIntegrationClient: RehabIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
