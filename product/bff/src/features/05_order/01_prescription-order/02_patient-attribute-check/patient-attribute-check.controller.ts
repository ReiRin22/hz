import { Controller } from '@nestjs/common';
import { PatientAttributeCheckService } from './patient-attribute-check.service';

@Controller('patient-attribute-check')
export class PatientAttributeCheckController {
  constructor(private readonly patientAttributeCheckService: PatientAttributeCheckService) {}

  // TODO: エンドポイントを実装
}
