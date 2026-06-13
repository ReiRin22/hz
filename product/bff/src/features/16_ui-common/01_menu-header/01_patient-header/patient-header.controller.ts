import { Controller } from '@nestjs/common';
import { PatientHeaderService } from './patient-header.service';

@Controller('patient-header')
export class PatientHeaderController {
  constructor(private readonly patientHeaderService: PatientHeaderService) {}

  // TODO: エンドポイントを実装
}
