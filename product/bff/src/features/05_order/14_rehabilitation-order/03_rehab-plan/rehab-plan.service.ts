import { Injectable } from '@nestjs/common';
import { RehabPlanClient } from './rehab-plan.client';

@Injectable()
export class RehabPlanService {
  constructor(private readonly rehabPlanClient: RehabPlanClient) {}

  // TODO: ビジネスロジックを実装
}
