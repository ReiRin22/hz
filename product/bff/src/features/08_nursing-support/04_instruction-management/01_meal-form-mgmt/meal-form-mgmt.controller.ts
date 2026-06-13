import { Controller } from '@nestjs/common';
import { MealFormMgmtService } from './meal-form-mgmt.service';

@Controller('meal-form-mgmt')
export class MealFormMgmtController {
  constructor(private readonly mealFormMgmtService: MealFormMgmtService) {}

  // TODO: エンドポイントを実装
}
