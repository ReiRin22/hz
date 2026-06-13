import { Injectable } from '@nestjs/common';
import { MealFormMgmtClient } from './meal-form-mgmt.client';

@Injectable()
export class MealFormMgmtService {
  constructor(private readonly mealFormMgmtClient: MealFormMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
