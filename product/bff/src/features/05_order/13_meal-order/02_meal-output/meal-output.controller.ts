import { Controller } from '@nestjs/common';
import { MealOutputService } from './meal-output.service';

@Controller('meal-output')
export class MealOutputController {
  constructor(private readonly mealOutputService: MealOutputService) {}

  // TODO: エンドポイントを実装
}
