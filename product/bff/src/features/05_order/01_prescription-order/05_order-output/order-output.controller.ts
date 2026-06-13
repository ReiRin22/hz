import { Controller } from '@nestjs/common';
import { OrderOutputService } from './order-output.service';

@Controller('order-output')
export class OrderOutputController {
  constructor(private readonly orderOutputService: OrderOutputService) {}

  // TODO: エンドポイントを実装
}
