import { Controller } from '@nestjs/common';
import { RehabPlanService } from './rehab-plan.service';

@Controller('rehab-plan')
export class RehabPlanController {
  constructor(private readonly rehabPlanService: RehabPlanService) {}

  // TODO: エンドポイントを実装
}
