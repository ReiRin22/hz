import { Injectable } from '@nestjs/common';
import { RehabPrescriptionClient } from './rehab-prescription.client';

@Injectable()
export class RehabPrescriptionService {
  constructor(private readonly rehabPrescriptionClient: RehabPrescriptionClient) {}

  // TODO: ビジネスロジックを実装
}
