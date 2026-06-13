import { Controller } from '@nestjs/common';
import { OrderSettingService } from './order-setting.service';

@Controller('order-setting')
export class OrderSettingController {
  constructor(private readonly orderSettingService: OrderSettingService) {}

  // TODO: エンドポイントを実装
}
