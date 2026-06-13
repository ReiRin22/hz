import { Injectable } from '@nestjs/common';
import { MealChangeClient } from './meal-change.client';

@Injectable()
export class MealChangeService {
  constructor(private readonly mealChangeClient: MealChangeClient) {}

  // TODO: ビジネスロジックを実装
}
