import { Controller } from '@nestjs/common';
import { GeneralSettingService } from './general-setting.service';

@Controller('general-setting')
export class GeneralSettingController {
  constructor(private readonly generalSettingService: GeneralSettingService) {}

  // TODO: エンドポイントを実装
}
