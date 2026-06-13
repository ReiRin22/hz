import { Controller } from '@nestjs/common';
import { InpatientInstructionService } from './inpatient-instruction.service';

@Controller('inpatient-instruction')
export class InpatientInstructionController {
  constructor(private readonly inpatientInstructionService: InpatientInstructionService) {}

  // TODO: エンドポイントを実装
}
