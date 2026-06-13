import { Injectable } from '@nestjs/common';
import { NursingDiagnosisClient } from './nursing-diagnosis.client';

@Injectable()
export class NursingDiagnosisService {
  constructor(private readonly nursingDiagnosisClient: NursingDiagnosisClient) {}

  // TODO: ビジネスロジックを実装
}
