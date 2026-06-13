import { Controller } from '@nestjs/common';
import { LabInstructionService } from './lab-instruction.service';

@Controller('lab-instruction')
export class LabInstructionController {
  constructor(private readonly labInstructionService: LabInstructionService) {}

  // TODO: エンドポイントを実装
}
