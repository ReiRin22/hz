import { Controller } from '@nestjs/common';
import { OrderSetRegistrationService } from './order-set-registration.service';

@Controller('order-set-registration')
export class OrderSetRegistrationController {
  constructor(private readonly orderSetRegistrationService: OrderSetRegistrationService) {}

  // TODO: エンドポイントを実装
}
