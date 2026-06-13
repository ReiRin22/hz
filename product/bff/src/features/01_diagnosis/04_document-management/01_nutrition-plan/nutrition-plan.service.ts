import { Injectable } from '@nestjs/common';
import { NutritionPlanClient } from './nutrition-plan.client';

@Injectable()
export class NutritionPlanService {
  constructor(private readonly nutritionPlanClient: NutritionPlanClient) {}

  // TODO: ビジネスロジックを実装
}
