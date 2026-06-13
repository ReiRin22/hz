import { Injectable } from '@nestjs/common';
import { OrderConfirmClient } from './order-confirm.client';

@Injectable()
export class OrderConfirmService {
  constructor(private readonly orderConfirmClient: OrderConfirmClient) {}

  // TODO: ビジネスロジックを実装
}
