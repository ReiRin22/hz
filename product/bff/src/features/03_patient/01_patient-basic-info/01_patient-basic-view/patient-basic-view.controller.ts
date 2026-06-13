import { Controller } from '@nestjs/common';
import { PatientBasicViewService } from './patient-basic-view.service';

@Controller('patient-basic-view')
export class PatientBasicViewController {
  constructor(private readonly patientBasicViewService: PatientBasicViewService) {}

  // TODO: エンドポイントを実装
}
