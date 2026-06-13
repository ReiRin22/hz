import { Injectable } from '@nestjs/common';
import { GeneralIntegrationClient } from './general-integration.client';

@Injectable()
export class GeneralIntegrationService {
  constructor(private readonly generalIntegrationClient: GeneralIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
