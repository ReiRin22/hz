import { Controller } from '@nestjs/common';
import { AdmissionSettingService } from './admission-setting.service';

@Controller('admission-setting')
export class AdmissionSettingController {
  constructor(private readonly admissionSettingService: AdmissionSettingService) {}

  // TODO: エンドポイントを実装
}
