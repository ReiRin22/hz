import { Controller } from '@nestjs/common';
import { SpecimenSettingService } from './specimen-setting.service';

@Controller('specimen-setting')
export class SpecimenSettingController {
  constructor(private readonly specimenSettingService: SpecimenSettingService) {}

  // TODO: エンドポイントを実装
}
