import { Controller } from '@nestjs/common';
import { PharmacyInstructionService } from './pharmacy-instruction.service';

@Controller('pharmacy-instruction')
export class PharmacyInstructionController {
  constructor(private readonly pharmacyInstructionService: PharmacyInstructionService) {}

  // TODO: エンドポイントを実装
}
