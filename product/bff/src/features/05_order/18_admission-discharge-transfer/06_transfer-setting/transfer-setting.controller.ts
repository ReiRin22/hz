import { Controller } from '@nestjs/common';
import { TransferSettingService } from './transfer-setting.service';

@Controller('transfer-setting')
export class TransferSettingController {
  constructor(private readonly transferSettingService: TransferSettingService) {}

  // TODO: エンドポイントを実装
}
