import { Controller } from '@nestjs/common';
import { EChartSharingService } from './e-chart-sharing.service';

@Controller('e-chart-sharing')
export class EChartSharingController {
  constructor(private readonly eChartSharingService: EChartSharingService) {}

  // TODO: エンドポイントを実装
}
