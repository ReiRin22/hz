import { Injectable } from '@nestjs/common';
import { OrderIntegrationClient } from './order-integration.client';

@Injectable()
export class OrderIntegrationService {
  constructor(private readonly orderIntegrationClient: OrderIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
