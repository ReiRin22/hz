import { Injectable } from '@nestjs/common';
import { CompositeSettingClient } from './composite-setting.client';

@Injectable()
export class CompositeSettingService {
  constructor(private readonly compositeSettingClient: CompositeSettingClient) {}

  // TODO: ビジネスロジックを実装
}
