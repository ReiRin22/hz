import { Injectable } from '@nestjs/common';
import { MedicationHistoryClient } from './medication-history.client';

@Injectable()
export class MedicationHistoryService {
  constructor(private readonly medicationHistoryClient: MedicationHistoryClient) {}

  // TODO: ビジネスロジックを実装
}
