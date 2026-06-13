import { Controller } from '@nestjs/common';
import { DiseasePatientListService } from './disease-patient-list.service';

@Controller('disease-patient-list')
export class DiseasePatientListController {
  constructor(private readonly diseasePatientListService: DiseasePatientListService) {}

  // TODO: エンドポイントを実装
}
