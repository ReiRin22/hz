import { Controller } from '@nestjs/common';
import { BacteriaSettingService } from './bacteria-setting.service';

@Controller('bacteria-setting')
export class BacteriaSettingController {
  constructor(private readonly bacteriaSettingService: BacteriaSettingService) {}

  // TODO: エンドポイントを実装
}
