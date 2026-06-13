import { Controller } from '@nestjs/common';
import { TransfusionIntegrationService } from './transfusion-integration.service';

@Controller('transfusion-integration')
export class TransfusionIntegrationController {
  constructor(private readonly transfusionIntegrationService: TransfusionIntegrationService) {}

  // TODO: エンドポイントを実装
}
