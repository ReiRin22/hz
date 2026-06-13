import { Injectable } from '@nestjs/common';
import { TreatmentSettingClient } from './treatment-setting.client';

@Injectable()
export class TreatmentSettingService {
  constructor(private readonly treatmentSettingClient: TreatmentSettingClient) {}

  // TODO: ビジネスロジックを実装
}
