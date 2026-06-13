import { Controller } from '@nestjs/common';
import { PhysiologySettingService } from './physiology-setting.service';

@Controller('physiology-setting')
export class PhysiologySettingController {
  constructor(private readonly physiologySettingService: PhysiologySettingService) {}

  // TODO: エンドポイントを実装
}
