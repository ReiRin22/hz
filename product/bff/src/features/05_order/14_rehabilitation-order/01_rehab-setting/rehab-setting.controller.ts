import { Controller } from '@nestjs/common';
import { RehabSettingService } from './rehab-setting.service';

@Controller('rehab-setting')
export class RehabSettingController {
  constructor(private readonly rehabSettingService: RehabSettingService) {}

  // TODO: エンドポイントを実装
}
