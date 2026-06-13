import { Controller } from '@nestjs/common';
import { SurgerySettingService } from './surgery-setting.service';

@Controller('surgery-setting')
export class SurgerySettingController {
  constructor(private readonly surgerySettingService: SurgerySettingService) {}

  // TODO: エンドポイントを実装
}
