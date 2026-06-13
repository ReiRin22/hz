import { Injectable } from '@nestjs/common';
import { GuidanceSettingClient } from './guidance-setting.client';

@Injectable()
export class GuidanceSettingService {
  constructor(private readonly guidanceSettingClient: GuidanceSettingClient) {}

  // TODO: ビジネスロジックを実装
}
