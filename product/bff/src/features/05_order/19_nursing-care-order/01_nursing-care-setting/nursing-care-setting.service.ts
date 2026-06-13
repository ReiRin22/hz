import { Injectable } from '@nestjs/common';
import { NursingCareSettingClient } from './nursing-care-setting.client';

@Injectable()
export class NursingCareSettingService {
  constructor(private readonly nursingCareSettingClient: NursingCareSettingClient) {}

  // TODO: ビジネスロジックを実装
}
