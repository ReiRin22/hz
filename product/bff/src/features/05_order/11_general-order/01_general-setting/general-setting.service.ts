import { Injectable } from '@nestjs/common';
import { GeneralSettingClient } from './general-setting.client';

@Injectable()
export class GeneralSettingService {
  constructor(private readonly generalSettingClient: GeneralSettingClient) {}

  // TODO: ビジネスロジックを実装
}
