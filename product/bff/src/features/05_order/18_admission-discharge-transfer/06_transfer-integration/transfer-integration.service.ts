import { Injectable } from '@nestjs/common';
import { TransferIntegrationClient } from './transfer-integration.client';

@Injectable()
export class TransferIntegrationService {
  constructor(private readonly transferIntegrationClient: TransferIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
