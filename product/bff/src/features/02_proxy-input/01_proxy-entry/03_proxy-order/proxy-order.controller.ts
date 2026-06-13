import { Controller } from '@nestjs/common';
import { ProxyOrderService } from './proxy-order.service';

@Controller('proxy-order')
export class ProxyOrderController {
  constructor(private readonly proxyOrderService: ProxyOrderService) {}

  // TODO: エンドポイントを実装
}
