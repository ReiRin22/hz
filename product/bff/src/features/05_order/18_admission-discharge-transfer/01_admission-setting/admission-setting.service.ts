import { Injectable } from '@nestjs/common';
import { AdmissionSettingClient } from './admission-setting.client';

@Injectable()
export class AdmissionSettingService {
  constructor(private readonly admissionSettingClient: AdmissionSettingClient) {}

  // TODO: ビジネスロジックを実装
}
