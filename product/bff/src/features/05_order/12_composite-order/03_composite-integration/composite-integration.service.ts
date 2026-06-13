import { Injectable } from '@nestjs/common';
import { CompositeIntegrationClient } from './composite-integration.client';

@Injectable()
export class CompositeIntegrationService {
  constructor(private readonly compositeIntegrationClient: CompositeIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
