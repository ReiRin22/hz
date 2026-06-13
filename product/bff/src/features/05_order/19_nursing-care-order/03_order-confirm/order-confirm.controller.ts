import { Controller } from '@nestjs/common';
import { OrderConfirmService } from './order-confirm.service';

@Controller('order-confirm')
export class OrderConfirmController {
  constructor(private readonly orderConfirmService: OrderConfirmService) {}

  // TODO: エンドポイントを実装
}
