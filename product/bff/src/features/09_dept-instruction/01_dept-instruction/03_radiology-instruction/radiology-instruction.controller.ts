import { Controller } from '@nestjs/common';
import { RadiologyInstructionService } from './radiology-instruction.service';

@Controller('radiology-instruction')
export class RadiologyInstructionController {
  constructor(private readonly radiologyInstructionService: RadiologyInstructionService) {}

  // TODO: エンドポイントを実装
}
