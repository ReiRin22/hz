import { Controller } from '@nestjs/common';
import { PathologySettingService } from './pathology-setting.service';

@Controller('pathology-setting')
export class PathologySettingController {
  constructor(private readonly pathologySettingService: PathologySettingService) {}

  // TODO: エンドポイントを実装
}
