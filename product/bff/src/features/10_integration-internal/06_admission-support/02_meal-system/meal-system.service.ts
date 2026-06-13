import { Injectable } from '@nestjs/common';
import { MealSystemClient } from './meal-system.client';

@Injectable()
export class MealSystemService {
  constructor(private readonly mealSystemClient: MealSystemClient) {}

  // TODO: ビジネスロジックを実装
}
