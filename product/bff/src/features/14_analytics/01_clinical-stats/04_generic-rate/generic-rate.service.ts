import { Injectable } from '@nestjs/common';
import { GenericRateClient } from './generic-rate.client';

@Injectable()
export class GenericRateService {
  constructor(private readonly genericRateClient: GenericRateClient) {}

  // TODO: ビジネスロジックを実装
}
