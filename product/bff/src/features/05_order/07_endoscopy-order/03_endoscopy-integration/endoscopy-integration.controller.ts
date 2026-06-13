import { Controller } from '@nestjs/common';
import { EndoscopyIntegrationService } from './endoscopy-integration.service';

@Controller('endoscopy-integration')
export class EndoscopyIntegrationController {
  constructor(private readonly endoscopyIntegrationService: EndoscopyIntegrationService) {}

  // TODO: エンドポイントを実装
}
