import { Injectable } from '@nestjs/common';
import { BacteriaSettingClient } from './bacteria-setting.client';

@Injectable()
export class BacteriaSettingService {
  constructor(private readonly bacteriaSettingClient: BacteriaSettingClient) {}

  // TODO: ビジネスロジックを実装
}
