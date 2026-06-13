import { Injectable } from '@nestjs/common';
import { TransfusionIntegrationClient } from './transfusion-integration.client';

@Injectable()
export class TransfusionIntegrationService {
  constructor(private readonly transfusionIntegrationClient: TransfusionIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
