import { Injectable } from '@nestjs/common';
import { InjectionSettingClient } from './injection-setting.client';

@Injectable()
export class InjectionSettingService {
  constructor(private readonly injectionSettingClient: InjectionSettingClient) {}

  // TODO: ビジネスロジックを実装
}
