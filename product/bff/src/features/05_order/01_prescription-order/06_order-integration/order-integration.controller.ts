import { Controller } from '@nestjs/common';
import { OrderIntegrationService } from './order-integration.service';

@Controller('order-integration')
export class OrderIntegrationController {
  constructor(private readonly orderIntegrationService: OrderIntegrationService) {}

  // TODO: エンドポイントを実装
}
