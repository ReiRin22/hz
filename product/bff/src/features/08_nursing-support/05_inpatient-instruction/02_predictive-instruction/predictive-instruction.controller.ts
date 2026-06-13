import { Controller } from '@nestjs/common';
import { PredictiveInstructionService } from './predictive-instruction.service';

@Controller('predictive-instruction')
export class PredictiveInstructionController {
  constructor(private readonly predictiveInstructionService: PredictiveInstructionService) {}

  // TODO: エンドポイントを実装
}
