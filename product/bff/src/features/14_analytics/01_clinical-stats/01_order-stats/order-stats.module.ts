import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderStatsController } from './order-stats.controller';
import { OrderStatsService } from './order-stats.service';
import { OrderStatsClient } from './order-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderStatsController],
  providers: [OrderStatsService, OrderStatsClient],
})
export class OrderStatsModule {}
