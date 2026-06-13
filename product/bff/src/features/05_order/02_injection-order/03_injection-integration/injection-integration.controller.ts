import { Controller } from '@nestjs/common';
import { InjectionIntegrationService } from './injection-integration.service';

@Controller('injection-integration')
export class InjectionIntegrationController {
  constructor(private readonly injectionIntegrationService: InjectionIntegrationService) {}

  // TODO: エンドポイントを実装
}
