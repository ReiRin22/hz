import { Controller } from '@nestjs/common';
import { ImagingSettingService } from './imaging-setting.service';

@Controller('imaging-setting')
export class ImagingSettingController {
  constructor(private readonly imagingSettingService: ImagingSettingService) {}

  // TODO: エンドポイントを実装
}
