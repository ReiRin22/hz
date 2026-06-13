import { Controller } from '@nestjs/common';
import { RehabInstructionService } from './rehab-instruction.service';

@Controller('rehab-instruction')
export class RehabInstructionController {
  constructor(private readonly rehabInstructionService: RehabInstructionService) {}

  // TODO: エンドポイントを実装
}
