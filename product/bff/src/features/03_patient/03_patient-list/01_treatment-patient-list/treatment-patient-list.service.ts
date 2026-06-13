import { Injectable } from '@nestjs/common';
import { TreatmentPatientListClient } from './treatment-patient-list.client';

@Injectable()
export class TreatmentPatientListService {
  constructor(private readonly treatmentPatientListClient: TreatmentPatientListClient) {}

  // TODO: ビジネスロジックを実装
}
