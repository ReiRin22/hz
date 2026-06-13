import { Controller } from '@nestjs/common';
import { SpecimenOutputService } from './specimen-output.service';

@Controller('specimen-output')
export class SpecimenOutputController {
  constructor(private readonly specimenOutputService: SpecimenOutputService) {}

  // TODO: エンドポイントを実装
}
