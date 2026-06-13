import { Injectable } from '@nestjs/common';
import { PhysiologyIntegrationClient } from './physiology-integration.client';

@Injectable()
export class PhysiologyIntegrationService {
  constructor(private readonly physiologyIntegrationClient: PhysiologyIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
