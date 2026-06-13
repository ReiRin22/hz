import { Injectable } from '@nestjs/common';
import { TransferSettingClient } from './transfer-setting.client';

@Injectable()
export class TransferSettingService {
  constructor(private readonly transferSettingClient: TransferSettingClient) {}

  // TODO: ビジネスロジックを実装
}
