import { Controller } from '@nestjs/common';
import { SpecimenSystemService } from './specimen-system.service';

@Controller('specimen-system')
export class SpecimenSystemController {
  constructor(private readonly specimenSystemService: SpecimenSystemService) {}

  // TODO: エンドポイントを実装
}
