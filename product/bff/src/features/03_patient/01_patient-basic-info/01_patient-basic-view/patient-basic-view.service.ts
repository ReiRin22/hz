import { Injectable } from '@nestjs/common';
import { PatientBasicViewClient } from './patient-basic-view.client';

@Injectable()
export class PatientBasicViewService {
  constructor(private readonly patientBasicViewClient: PatientBasicViewClient) {}

  // TODO: ビジネスロジックを実装
}
