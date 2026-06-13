import { Injectable } from '@nestjs/common';
import { UtilizationRateClient } from './utilization-rate.client';

@Injectable()
export class UtilizationRateService {
  constructor(private readonly utilizationRateClient: UtilizationRateClient) {}

  // TODO: ビジネスロジックを実装
}
