import { Controller } from '@nestjs/common';
import { CompositeSettingService } from './composite-setting.service';

@Controller('composite-setting')
export class CompositeSettingController {
  constructor(private readonly compositeSettingService: CompositeSettingService) {}

  // TODO: エンドポイントを実装
}
