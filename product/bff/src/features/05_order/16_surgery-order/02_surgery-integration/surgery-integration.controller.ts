import { Controller } from '@nestjs/common';
import { SurgeryIntegrationService } from './surgery-integration.service';

@Controller('surgery-integration')
export class SurgeryIntegrationController {
  constructor(private readonly surgeryIntegrationService: SurgeryIntegrationService) {}

  // TODO: エンドポイントを実装
}
