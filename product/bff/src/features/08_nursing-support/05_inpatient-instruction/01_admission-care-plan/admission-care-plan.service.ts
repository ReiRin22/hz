import { Injectable } from '@nestjs/common';
import { AdmissionCarePlanClient } from './admission-care-plan.client';

@Injectable()
export class AdmissionCarePlanService {
  constructor(private readonly admissionCarePlanClient: AdmissionCarePlanClient) {}

  // TODO: ビジネスロジックを実装
}
