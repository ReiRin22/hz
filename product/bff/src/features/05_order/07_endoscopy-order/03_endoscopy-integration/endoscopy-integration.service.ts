import { Injectable } from '@nestjs/common';
import { EndoscopyIntegrationClient } from './endoscopy-integration.client';

@Injectable()
export class EndoscopyIntegrationService {
  constructor(private readonly endoscopyIntegrationClient: EndoscopyIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
