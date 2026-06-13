import { Injectable } from '@nestjs/common';
import { TransfusionSettingClient } from './transfusion-setting.client';

@Injectable()
export class TransfusionSettingService {
  constructor(private readonly transfusionSettingClient: TransfusionSettingClient) {}

  // TODO: ビジネスロジックを実装
}
