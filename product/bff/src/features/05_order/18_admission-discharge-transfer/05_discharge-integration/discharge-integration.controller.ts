import { Controller } from '@nestjs/common';
import { DischargeIntegrationService } from './discharge-integration.service';

@Controller('discharge-integration')
export class DischargeIntegrationController {
  constructor(private readonly dischargeIntegrationService: DischargeIntegrationService) {}

  // TODO: エンドポイントを実装
}
