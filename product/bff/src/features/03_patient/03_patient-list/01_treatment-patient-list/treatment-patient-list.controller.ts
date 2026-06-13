import { Controller } from '@nestjs/common';
import { TreatmentPatientListService } from './treatment-patient-list.service';

@Controller('treatment-patient-list')
export class TreatmentPatientListController {
  constructor(private readonly treatmentPatientListService: TreatmentPatientListService) {}

  // TODO: エンドポイントを実装
}
