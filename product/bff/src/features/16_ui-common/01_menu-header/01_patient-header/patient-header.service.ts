import { Injectable } from '@nestjs/common';
import { PatientHeaderClient } from './patient-header.client';

@Injectable()
export class PatientHeaderService {
  constructor(private readonly patientHeaderClient: PatientHeaderClient) {}

  // TODO: ビジネスロジックを実装
}
