import { Injectable } from '@nestjs/common';
import { SurgerySettingClient } from './surgery-setting.client';

@Injectable()
export class SurgerySettingService {
  constructor(private readonly surgerySettingClient: SurgerySettingClient) {}

  // TODO: ビジネスロジックを実装
}
