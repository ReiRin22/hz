import { Controller } from '@nestjs/common';
import { TransferIntegrationService } from './transfer-integration.service';

@Controller('transfer-integration')
export class TransferIntegrationController {
  constructor(private readonly transferIntegrationService: TransferIntegrationService) {}

  // TODO: エンドポイントを実装
}
