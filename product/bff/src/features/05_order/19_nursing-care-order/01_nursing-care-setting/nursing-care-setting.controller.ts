import { Controller } from '@nestjs/common';
import { NursingCareSettingService } from './nursing-care-setting.service';

@Controller('nursing-care-setting')
export class NursingCareSettingController {
  constructor(private readonly nursingCareSettingService: NursingCareSettingService) {}

  // TODO: エンドポイントを実装
}
