import { Controller } from '@nestjs/common';
import { NutritionInstructionService } from './nutrition-instruction.service';

@Controller('nutrition-instruction')
export class NutritionInstructionController {
  constructor(private readonly nutritionInstructionService: NutritionInstructionService) {}

  // TODO: エンドポイントを実装
}
