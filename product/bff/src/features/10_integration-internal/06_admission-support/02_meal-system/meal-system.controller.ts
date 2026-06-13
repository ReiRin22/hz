import { Controller } from '@nestjs/common';
import { MealSystemService } from './meal-system.service';

@Controller('meal-system')
export class MealSystemController {
  constructor(private readonly mealSystemService: MealSystemService) {}

  // TODO: エンドポイントを実装
}
