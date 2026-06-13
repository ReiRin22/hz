import { Injectable } from '@nestjs/common';
import { BacteriaIntegrationClient } from './bacteria-integration.client';

@Injectable()
export class BacteriaIntegrationService {
  constructor(private readonly bacteriaIntegrationClient: BacteriaIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
