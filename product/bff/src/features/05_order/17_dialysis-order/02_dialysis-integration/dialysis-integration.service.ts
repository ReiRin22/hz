import { Injectable } from '@nestjs/common';
import { DialysisIntegrationClient } from './dialysis-integration.client';

@Injectable()
export class DialysisIntegrationService {
  constructor(private readonly dialysisIntegrationClient: DialysisIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
