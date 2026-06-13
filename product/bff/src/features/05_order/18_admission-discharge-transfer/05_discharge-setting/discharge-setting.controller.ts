import { Controller } from '@nestjs/common';
import { DischargeSettingService } from './discharge-setting.service';

@Controller('discharge-setting')
export class DischargeSettingController {
  constructor(private readonly dischargeSettingService: DischargeSettingService) {}

  // TODO: エンドポイントを実装
}
