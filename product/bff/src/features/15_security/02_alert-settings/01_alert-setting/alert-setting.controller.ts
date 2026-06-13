import { Controller } from '@nestjs/common';
import { AlertSettingService } from './alert-setting.service';

@Controller('alert-setting')
export class AlertSettingController {
  constructor(private readonly alertSettingService: AlertSettingService) {}

  // TODO: エンドポイントを実装
}
