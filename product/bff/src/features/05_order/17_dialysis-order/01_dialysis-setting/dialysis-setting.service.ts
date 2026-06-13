import { Injectable } from '@nestjs/common';
import { DialysisSettingClient } from './dialysis-setting.client';

@Injectable()
export class DialysisSettingService {
  constructor(private readonly dialysisSettingClient: DialysisSettingClient) {}

  // TODO: ビジネスロジックを実装
}
