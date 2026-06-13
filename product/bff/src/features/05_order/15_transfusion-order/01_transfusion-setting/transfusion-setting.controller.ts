import { Controller } from '@nestjs/common';
import { TransfusionSettingService } from './transfusion-setting.service';

@Controller('transfusion-setting')
export class TransfusionSettingController {
  constructor(private readonly transfusionSettingService: TransfusionSettingService) {}

  // TODO: エンドポイントを実装
}
