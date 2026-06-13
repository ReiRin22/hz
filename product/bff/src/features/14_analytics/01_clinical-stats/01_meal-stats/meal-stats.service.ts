import { Injectable } from '@nestjs/common';
import { MealStatsClient } from './meal-stats.client';

@Injectable()
export class MealStatsService {
  constructor(private readonly mealStatsClient: MealStatsClient) {}

  // TODO: ビジネスロジックを実装
}
