import { Controller } from '@nestjs/common';
import { SpecimenIntegrationService } from './specimen-integration.service';

@Controller('specimen-integration')
export class SpecimenIntegrationController {
  constructor(private readonly specimenIntegrationService: SpecimenIntegrationService) {}

  // TODO: エンドポイントを実装
}
