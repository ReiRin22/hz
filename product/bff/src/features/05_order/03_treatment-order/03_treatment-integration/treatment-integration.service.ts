import { Injectable } from '@nestjs/common';
import { TreatmentIntegrationClient } from './treatment-integration.client';

@Injectable()
export class TreatmentIntegrationService {
  constructor(private readonly treatmentIntegrationClient: TreatmentIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
