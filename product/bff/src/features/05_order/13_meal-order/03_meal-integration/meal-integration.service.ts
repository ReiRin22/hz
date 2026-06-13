import { Injectable } from '@nestjs/common';
import { MealIntegrationClient } from './meal-integration.client';

@Injectable()
export class MealIntegrationService {
  constructor(private readonly mealIntegrationClient: MealIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
