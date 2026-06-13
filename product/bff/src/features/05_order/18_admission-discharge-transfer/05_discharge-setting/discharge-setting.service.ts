import { Injectable } from '@nestjs/common';
import { DischargeSettingClient } from './discharge-setting.client';

@Injectable()
export class DischargeSettingService {
  constructor(private readonly dischargeSettingClient: DischargeSettingClient) {}

  // TODO: ビジネスロジックを実装
}
