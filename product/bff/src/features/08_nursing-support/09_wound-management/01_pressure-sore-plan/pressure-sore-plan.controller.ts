import { Controller } from '@nestjs/common';
import { PressureSorePlanService } from './pressure-sore-plan.service';

@Controller('pressure-sore-plan')
export class PressureSorePlanController {
  constructor(private readonly pressureSorePlanService: PressureSorePlanService) {}

  // TODO: エンドポイントを実装
}
