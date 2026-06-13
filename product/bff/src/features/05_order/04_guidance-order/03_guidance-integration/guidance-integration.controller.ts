import { Controller } from '@nestjs/common';
import { GuidanceIntegrationService } from './guidance-integration.service';

@Controller('guidance-integration')
export class GuidanceIntegrationController {
  constructor(private readonly guidanceIntegrationService: GuidanceIntegrationService) {}

  // TODO: エンドポイントを実装
}
