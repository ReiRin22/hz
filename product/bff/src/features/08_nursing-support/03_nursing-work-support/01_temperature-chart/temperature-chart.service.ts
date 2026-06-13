import { Injectable } from '@nestjs/common';
import { TemperatureChartClient } from './temperature-chart.client';

@Injectable()
export class TemperatureChartService {
  constructor(private readonly temperatureChartClient: TemperatureChartClient) {}

  // TODO: ビジネスロジックを実装
}
