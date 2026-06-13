import { Controller } from '@nestjs/common';
import { UtilizationRateService } from './utilization-rate.service';

@Controller('utilization-rate')
export class UtilizationRateController {
  constructor(private readonly utilizationRateService: UtilizationRateService) {}

  // TODO: エンドポイントを実装
}
