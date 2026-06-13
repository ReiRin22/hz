import { Controller } from '@nestjs/common';
import { DialysisSettingService } from './dialysis-setting.service';

@Controller('dialysis-setting')
export class DialysisSettingController {
  constructor(private readonly dialysisSettingService: DialysisSettingService) {}

  // TODO: エンドポイントを実装
}
