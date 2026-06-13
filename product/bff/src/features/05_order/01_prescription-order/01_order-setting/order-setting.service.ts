import { Injectable } from '@nestjs/common';
import { OrderSettingClient } from './order-setting.client';

@Injectable()
export class OrderSettingService {
  constructor(private readonly orderSettingClient: OrderSettingClient) {}

  // TODO: ビジネスロジックを実装
}
