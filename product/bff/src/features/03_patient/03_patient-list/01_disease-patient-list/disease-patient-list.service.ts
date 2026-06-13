import { Injectable } from '@nestjs/common';
import { DiseasePatientListClient } from './disease-patient-list.client';

@Injectable()
export class DiseasePatientListService {
  constructor(private readonly diseasePatientListClient: DiseasePatientListClient) {}

  // TODO: ビジネスロジックを実装
}
