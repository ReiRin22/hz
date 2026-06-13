import { Controller } from '@nestjs/common';
import { GuidanceSettingService } from './guidance-setting.service';

@Controller('guidance-setting')
export class GuidanceSettingController {
  constructor(private readonly guidanceSettingService: GuidanceSettingService) {}

  // TODO: エンドポイントを実装
}
