import { Injectable } from '@nestjs/common';
import { SpecimenIntegrationClient } from './specimen-integration.client';

@Injectable()
export class SpecimenIntegrationService {
  constructor(private readonly specimenIntegrationClient: SpecimenIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
