import { Injectable } from '@nestjs/common';
import { PatientAttributeCheckClient } from './patient-attribute-check.client';

@Injectable()
export class PatientAttributeCheckService {
  constructor(private readonly patientAttributeCheckClient: PatientAttributeCheckClient) {}

  // TODO: ビジネスロジックを実装
}
