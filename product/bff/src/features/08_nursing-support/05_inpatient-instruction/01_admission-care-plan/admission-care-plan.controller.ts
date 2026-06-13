import { Controller } from '@nestjs/common';
import { AdmissionCarePlanService } from './admission-care-plan.service';

@Controller('admission-care-plan')
export class AdmissionCarePlanController {
  constructor(private readonly admissionCarePlanService: AdmissionCarePlanService) {}

  // TODO: エンドポイントを実装
}
