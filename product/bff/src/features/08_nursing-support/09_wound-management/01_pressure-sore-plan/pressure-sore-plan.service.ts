import { Injectable } from '@nestjs/common';
import { PressureSorePlanClient } from './pressure-sore-plan.client';

@Injectable()
export class PressureSorePlanService {
  constructor(private readonly pressureSorePlanClient: PressureSorePlanClient) {}

  // TODO: ビジネスロジックを実装
}
