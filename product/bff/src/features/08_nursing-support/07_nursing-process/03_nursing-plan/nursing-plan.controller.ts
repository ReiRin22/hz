import { Controller } from '@nestjs/common';
import { NursingPlanService } from './nursing-plan.service';

@Controller('nursing-plan')
export class NursingPlanController {
  constructor(private readonly nursingPlanService: NursingPlanService) {}

  // TODO: エンドポイントを実装
}
