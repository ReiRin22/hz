import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EChartSharingController } from './e-chart-sharing.controller';
import { EChartSharingService } from './e-chart-sharing.service';
import { EChartSharingClient } from './e-chart-sharing.client';

@Module({
  imports: [HttpModule],
  controllers: [EChartSharingController],
  providers: [EChartSharingService, EChartSharingClient],
})
export class EChartSharingModule {}
