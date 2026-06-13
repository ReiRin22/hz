import { Injectable } from '@nestjs/common';
import { SurgeryIntegrationClient } from './surgery-integration.client';

@Injectable()
export class SurgeryIntegrationService {
  constructor(private readonly surgeryIntegrationClient: SurgeryIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
