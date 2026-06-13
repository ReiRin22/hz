import { Controller } from '@nestjs/common';
import { ExternalViewerService } from './external-viewer.service';

@Controller('external-viewer')
export class ExternalViewerController {
  constructor(private readonly externalViewerService: ExternalViewerService) {}

  // TODO: エンドポイントを実装
}
