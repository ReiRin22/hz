import { Controller } from '@nestjs/common';
import { AdmissionIntegrationService } from './admission-integration.service';

@Controller('admission-integration')
export class AdmissionIntegrationController {
  constructor(private readonly admissionIntegrationService: AdmissionIntegrationService) {}

  // TODO: エンドポイントを実装
}
