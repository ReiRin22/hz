import { Controller } from '@nestjs/common';
import { ImagingIntegrationService } from './imaging-integration.service';

@Controller('imaging-integration')
export class ImagingIntegrationController {
  constructor(private readonly imagingIntegrationService: ImagingIntegrationService) {}

  // TODO: エンドポイントを実装
}
