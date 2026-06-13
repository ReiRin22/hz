import { Injectable } from '@nestjs/common';
import { MealSettingClient } from './meal-setting.client';

@Injectable()
export class MealSettingService {
  constructor(private readonly mealSettingClient: MealSettingClient) {}

  // TODO: ビジネスロジックを実装
}
