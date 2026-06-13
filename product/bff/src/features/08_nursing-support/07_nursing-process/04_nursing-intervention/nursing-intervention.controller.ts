import { Controller } from '@nestjs/common';
import { NursingInterventionService } from './nursing-intervention.service';

@Controller('nursing-intervention')
export class NursingInterventionController {
  constructor(private readonly nursingInterventionService: NursingInterventionService) {}

  // TODO: エンドポイントを実装
}
