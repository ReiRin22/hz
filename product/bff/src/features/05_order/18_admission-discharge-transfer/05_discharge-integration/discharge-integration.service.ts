import { Injectable } from '@nestjs/common';
import { DischargeIntegrationClient } from './discharge-integration.client';

@Injectable()
export class DischargeIntegrationService {
  constructor(private readonly dischargeIntegrationClient: DischargeIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
