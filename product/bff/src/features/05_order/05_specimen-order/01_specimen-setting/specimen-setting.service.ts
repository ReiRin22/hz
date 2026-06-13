import { Injectable } from '@nestjs/common';
import { SpecimenSettingClient } from './specimen-setting.client';

@Injectable()
export class SpecimenSettingService {
  constructor(private readonly specimenSettingClient: SpecimenSettingClient) {}

  // TODO: ビジネスロジックを実装
}
