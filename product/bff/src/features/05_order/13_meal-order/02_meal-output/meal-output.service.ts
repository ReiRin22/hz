import { Injectable } from '@nestjs/common';
import { MealOutputClient } from './meal-output.client';

@Injectable()
export class MealOutputService {
  constructor(private readonly mealOutputClient: MealOutputClient) {}

  // TODO: ビジネスロジックを実装
}
