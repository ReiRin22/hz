import { Injectable } from '@nestjs/common';
import { TreatmentOutputClient } from './treatment-output.client';

@Injectable()
export class TreatmentOutputService {
  constructor(private readonly treatmentOutputClient: TreatmentOutputClient) {}

  // TODO: ビジネスロジックを実装
}
