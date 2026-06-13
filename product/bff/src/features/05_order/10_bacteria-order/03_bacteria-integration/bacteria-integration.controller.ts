import { Controller } from '@nestjs/common';
import { BacteriaIntegrationService } from './bacteria-integration.service';

@Controller('bacteria-integration')
export class BacteriaIntegrationController {
  constructor(private readonly bacteriaIntegrationService: BacteriaIntegrationService) {}

  // TODO: エンドポイントを実装
}
