import { Injectable } from '@nestjs/common';
import { OrderSetRegistrationClient } from './order-set-registration.client';

@Injectable()
export class OrderSetRegistrationService {
  constructor(private readonly orderSetRegistrationClient: OrderSetRegistrationClient) {}

  // TODO: ビジネスロジックを実装
}
