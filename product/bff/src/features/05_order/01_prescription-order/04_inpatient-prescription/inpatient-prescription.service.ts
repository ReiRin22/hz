import { Injectable } from '@nestjs/common';
import { InpatientPrescriptionClient } from './inpatient-prescription.client';

@Injectable()
export class InpatientPrescriptionService {
  constructor(private readonly inpatientPrescriptionClient: InpatientPrescriptionClient) {}

  // TODO: ビジネスロジックを実装
}
