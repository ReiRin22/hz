import { Injectable } from '@nestjs/common';
import { PhysiologySettingClient } from './physiology-setting.client';

@Injectable()
export class PhysiologySettingService {
  constructor(private readonly physiologySettingClient: PhysiologySettingClient) {}

  // TODO: ビジネスロジックを実装
}
