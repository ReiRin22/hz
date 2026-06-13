import { Controller } from '@nestjs/common';
import { InjectionSettingService } from './injection-setting.service';

@Controller('injection-setting')
export class InjectionSettingController {
  constructor(private readonly injectionSettingService: InjectionSettingService) {}

  // TODO: エンドポイントを実装
}
