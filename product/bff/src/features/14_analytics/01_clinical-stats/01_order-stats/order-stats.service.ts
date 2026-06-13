import { Injectable } from '@nestjs/common';
import { OrderStatsClient } from './order-stats.client';

@Injectable()
export class OrderStatsService {
  constructor(private readonly orderStatsClient: OrderStatsClient) {}

  // TODO: ビジネスロジックを実装
}
