import { Controller } from '@nestjs/common';
import { DialysisInstructionService } from './dialysis-instruction.service';

@Controller('dialysis-instruction')
export class DialysisInstructionController {
  constructor(private readonly dialysisInstructionService: DialysisInstructionService) {}

  // TODO: エンドポイントを実装
}
