import { Controller } from '@nestjs/common';
import { MealStatsService } from './meal-stats.service';

@Controller('meal-stats')
export class MealStatsController {
  constructor(private readonly mealStatsService: MealStatsService) {}

  // TODO: エンドポイントを実装
}
