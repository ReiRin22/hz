import { Controller } from '@nestjs/common';
import { OrderStatsService } from './order-stats.service';

@Controller('order-stats')
export class OrderStatsController {
  constructor(private readonly orderStatsService: OrderStatsService) {}

  // TODO: エンドポイントを実装
}
