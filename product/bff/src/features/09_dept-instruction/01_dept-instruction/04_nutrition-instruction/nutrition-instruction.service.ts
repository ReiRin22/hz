import { Injectable } from '@nestjs/common';
import { NutritionInstructionClient } from './nutrition-instruction.client';

@Injectable()
export class NutritionInstructionService {
  constructor(private readonly nutritionInstructionClient: NutritionInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
