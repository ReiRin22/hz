import { Controller } from '@nestjs/common';
import { NursingCareIntegrationService } from './nursing-care-integration.service';

@Controller('nursing-care-integration')
export class NursingCareIntegrationController {
  constructor(private readonly nursingCareIntegrationService: NursingCareIntegrationService) {}

  // TODO: エンドポイントを実装
}
