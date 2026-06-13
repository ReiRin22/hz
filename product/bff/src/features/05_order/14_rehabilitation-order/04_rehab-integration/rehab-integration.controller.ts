import { Controller } from '@nestjs/common';
import { RehabIntegrationService } from './rehab-integration.service';

@Controller('rehab-integration')
export class RehabIntegrationController {
  constructor(private readonly rehabIntegrationService: RehabIntegrationService) {}

  // TODO: エンドポイントを実装
}
