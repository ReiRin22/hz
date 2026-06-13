import { Injectable } from '@nestjs/common';
import { NursingCareIntegrationClient } from './nursing-care-integration.client';

@Injectable()
export class NursingCareIntegrationService {
  constructor(private readonly nursingCareIntegrationClient: NursingCareIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
