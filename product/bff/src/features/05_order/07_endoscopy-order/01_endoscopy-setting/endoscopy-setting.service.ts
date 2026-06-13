import { Injectable } from '@nestjs/common';
import { EndoscopySettingClient } from './endoscopy-setting.client';

@Injectable()
export class EndoscopySettingService {
  constructor(private readonly endoscopySettingClient: EndoscopySettingClient) {}

  // TODO: ビジネスロジックを実装
}
