import { Controller } from '@nestjs/common';
import { MealChangeService } from './meal-change.service';

@Controller('meal-change')
export class MealChangeController {
  constructor(private readonly mealChangeService: MealChangeService) {}

  // TODO: エンドポイントを実装
}
