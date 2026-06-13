import { Controller } from '@nestjs/common';
import { EndoscopySettingService } from './endoscopy-setting.service';

@Controller('endoscopy-setting')
export class EndoscopySettingController {
  constructor(private readonly endoscopySettingService: EndoscopySettingService) {}

  // TODO: エンドポイントを実装
}
