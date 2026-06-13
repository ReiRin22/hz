import { Controller } from '@nestjs/common';
import { ParameterSettingService } from './parameter-setting.service';

@Controller('parameter-setting')
export class ParameterSettingController {
  constructor(private readonly parameterSettingService: ParameterSettingService) {}

  // TODO: エンドポイントを実装
}
