import { Controller } from '@nestjs/common';
import { GeneralIntegrationService } from './general-integration.service';

@Controller('general-integration')
export class GeneralIntegrationController {
  constructor(private readonly generalIntegrationService: GeneralIntegrationService) {}

  // TODO: エンドポイントを実装
}
