import { Controller } from '@nestjs/common';
import { TemperatureChartService } from './temperature-chart.service';

@Controller('temperature-chart')
export class TemperatureChartController {
  constructor(private readonly temperatureChartService: TemperatureChartService) {}

  // TODO: エンドポイントを実装
}
