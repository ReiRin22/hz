import { Controller } from '@nestjs/common';
import { MealIntegrationService } from './meal-integration.service';

@Controller('meal-integration')
export class MealIntegrationController {
  constructor(private readonly mealIntegrationService: MealIntegrationService) {}

  // TODO: エンドポイントを実装
}
