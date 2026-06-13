import { Injectable } from '@nestjs/common';
import { PatientListClient } from './patient-list.client';

@Injectable()
export class PatientListService {
  constructor(private readonly patientListClient: PatientListClient) {}

  // TODO: ビジネスロジックを実装
}
