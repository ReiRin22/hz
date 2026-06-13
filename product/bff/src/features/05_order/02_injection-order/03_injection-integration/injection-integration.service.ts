import { Injectable } from '@nestjs/common';
import { InjectionIntegrationClient } from './injection-integration.client';

@Injectable()
export class InjectionIntegrationService {
  constructor(private readonly injectionIntegrationClient: InjectionIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
