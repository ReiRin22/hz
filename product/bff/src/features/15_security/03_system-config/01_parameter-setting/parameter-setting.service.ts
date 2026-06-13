import { Injectable } from '@nestjs/common';
import { ParameterSettingClient } from './parameter-setting.client';

@Injectable()
export class ParameterSettingService {
  constructor(private readonly parameterSettingClient: ParameterSettingClient) {}

  // TODO: ビジネスロジックを実装
}
