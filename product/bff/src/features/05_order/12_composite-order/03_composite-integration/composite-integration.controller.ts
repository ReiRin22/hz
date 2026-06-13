import { Controller } from '@nestjs/common';
import { CompositeIntegrationService } from './composite-integration.service';

@Controller('composite-integration')
export class CompositeIntegrationController {
  constructor(private readonly compositeIntegrationService: CompositeIntegrationService) {}

  // TODO: エンドポイントを実装
}
