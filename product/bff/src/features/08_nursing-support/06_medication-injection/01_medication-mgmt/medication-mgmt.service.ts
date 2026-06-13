import { Injectable } from '@nestjs/common';
import { MedicationMgmtClient } from './medication-mgmt.client';

@Injectable()
export class MedicationMgmtService {
  constructor(private readonly medicationMgmtClient: MedicationMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
