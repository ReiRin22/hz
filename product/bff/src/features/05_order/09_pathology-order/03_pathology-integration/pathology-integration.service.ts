import { Injectable } from '@nestjs/common';
import { PathologyIntegrationClient } from './pathology-integration.client';

@Injectable()
export class PathologyIntegrationService {
  constructor(private readonly pathologyIntegrationClient: PathologyIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
