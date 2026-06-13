import { Controller } from '@nestjs/common';
import { TreatmentIntegrationService } from './treatment-integration.service';

@Controller('treatment-integration')
export class TreatmentIntegrationController {
  constructor(private readonly treatmentIntegrationService: TreatmentIntegrationService) {}

  // TODO: エンドポイントを実装
}
