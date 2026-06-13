import { Injectable } from '@nestjs/common';
import { NursingPlanClient } from './nursing-plan.client';

@Injectable()
export class NursingPlanService {
  constructor(private readonly nursingPlanClient: NursingPlanClient) {}

  // TODO: ビジネスロジックを実装
}
