import { Injectable } from '@nestjs/common';
import { AdmissionIntegrationClient } from './admission-integration.client';

@Injectable()
export class AdmissionIntegrationService {
  constructor(private readonly admissionIntegrationClient: AdmissionIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
