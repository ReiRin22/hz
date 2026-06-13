import { Injectable } from '@nestjs/common';
import { PathologySettingClient } from './pathology-setting.client';

@Injectable()
export class PathologySettingService {
  constructor(private readonly pathologySettingClient: PathologySettingClient) {}

  // TODO: ビジネスロジックを実装
}
