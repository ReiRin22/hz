import { Controller } from '@nestjs/common';
import { TreatmentOutputService } from './treatment-output.service';

@Controller('treatment-output')
export class TreatmentOutputController {
  constructor(private readonly treatmentOutputService: TreatmentOutputService) {}

  // TODO: エンドポイントを実装
}
