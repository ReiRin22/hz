import { Controller } from '@nestjs/common';
import { PhysiologyIntegrationService } from './physiology-integration.service';

@Controller('physiology-integration')
export class PhysiologyIntegrationController {
  constructor(private readonly physiologyIntegrationService: PhysiologyIntegrationService) {}

  // TODO: エンドポイントを実装
}
