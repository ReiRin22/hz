import { Controller } from '@nestjs/common';
import { NutritionPlanService } from './nutrition-plan.service';

@Controller('nutrition-plan')
export class NutritionPlanController {
  constructor(private readonly nutritionPlanService: NutritionPlanService) {}

  // TODO: エンドポイントを実装
}
