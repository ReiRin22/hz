import { Injectable } from '@nestjs/common';
import { AlertSettingClient } from './alert-setting.client';

@Injectable()
export class AlertSettingService {
  constructor(private readonly alertSettingClient: AlertSettingClient) {}

  // TODO: ビジネスロジックを実装
}
