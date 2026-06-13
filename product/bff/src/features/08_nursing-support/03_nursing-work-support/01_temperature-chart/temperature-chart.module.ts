import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TemperatureChartController } from './temperature-chart.controller';
import { TemperatureChartService } from './temperature-chart.service';
import { TemperatureChartClient } from './temperature-chart.client';

@Module({
  imports: [HttpModule],
  controllers: [TemperatureChartController],
  providers: [TemperatureChartService, TemperatureChartClient],
})
export class TemperatureChartModule {}
