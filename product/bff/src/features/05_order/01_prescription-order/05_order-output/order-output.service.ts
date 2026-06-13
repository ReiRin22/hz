import { Injectable } from '@nestjs/common';
import { OrderOutputClient } from './order-output.client';

@Injectable()
export class OrderOutputService {
  constructor(private readonly orderOutputClient: OrderOutputClient) {}

  // TODO: ビジネスロジックを実装
}
