import { Controller } from '@nestjs/common';
import { MealSettingService } from './meal-setting.service';

@Controller('meal-setting')
export class MealSettingController {
  constructor(private readonly mealSettingService: MealSettingService) {}

  // TODO: エンドポイントを実装
}
