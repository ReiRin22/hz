import { Injectable } from '@nestjs/common';
import { ImagingSettingClient } from './imaging-setting.client';

@Injectable()
export class ImagingSettingService {
  constructor(private readonly imagingSettingClient: ImagingSettingClient) {}

  // TODO: ビジネスロジックを実装
}
