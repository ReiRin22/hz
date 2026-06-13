import { Controller } from '@nestjs/common';
import { DialysisIntegrationService } from './dialysis-integration.service';

@Controller('dialysis-integration')
export class DialysisIntegrationController {
  constructor(private readonly dialysisIntegrationService: DialysisIntegrationService) {}

  // TODO: エンドポイントを実装
}
