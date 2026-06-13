import { Injectable } from '@nestjs/common';
import { PatientIdCheckClient } from './patient-id-check.client';

@Injectable()
export class PatientIdCheckService {
  constructor(private readonly patientIdCheckClient: PatientIdCheckClient) {}

  // TODO: ビジネスロジックを実装
}
