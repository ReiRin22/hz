import { Controller } from '@nestjs/common';
import { PatientIdCheckService } from './patient-id-check.service';

@Controller('patient-id-check')
export class PatientIdCheckController {
  constructor(private readonly patientIdCheckService: PatientIdCheckService) {}

  // TODO: エンドポイントを実装
}
