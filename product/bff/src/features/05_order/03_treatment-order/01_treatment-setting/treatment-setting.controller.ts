import { Controller } from '@nestjs/common';
import { TreatmentSettingService } from './treatment-setting.service';

@Controller('treatment-setting')
export class TreatmentSettingController {
  constructor(private readonly treatmentSettingService: TreatmentSettingService) {}

  // TODO: エンドポイントを実装
}
