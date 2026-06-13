import { Injectable } from '@nestjs/common';
import { RehabSettingClient } from './rehab-setting.client';

@Injectable()
export class RehabSettingService {
  constructor(private readonly rehabSettingClient: RehabSettingClient) {}

  // TODO: ビジネスロジックを実装
}
