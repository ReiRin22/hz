import { Controller } from '@nestjs/common';
import { PatientListService } from './patient-list.service';

@Controller('patient-list')
export class PatientListController {
  constructor(private readonly patientListService: PatientListService) {}

  // TODO: エンドポイントを実装
}
