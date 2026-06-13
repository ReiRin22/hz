import { Controller } from '@nestjs/common';
import { PathologyIntegrationService } from './pathology-integration.service';

@Controller('pathology-integration')
export class PathologyIntegrationController {
  constructor(private readonly pathologyIntegrationService: PathologyIntegrationService) {}

  // TODO: エンドポイントを実装
}
