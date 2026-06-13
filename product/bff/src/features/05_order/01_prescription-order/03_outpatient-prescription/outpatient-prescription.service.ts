import { Injectable } from '@nestjs/common';
import { OutpatientPrescriptionClient } from './outpatient-prescription.client';

@Injectable()
export class OutpatientPrescriptionService {
  constructor(private readonly outpatientPrescriptionClient: OutpatientPrescriptionClient) {}

  // TODO: ビジネスロジックを実装
}
