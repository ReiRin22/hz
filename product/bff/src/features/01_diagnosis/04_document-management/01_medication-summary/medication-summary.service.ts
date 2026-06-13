import { Injectable } from '@nestjs/common';
import { MedicationSummaryClient } from './medication-summary.client';

@Injectable()
export class MedicationSummaryService {
  constructor(private readonly medicationSummaryClient: MedicationSummaryClient) {}

  // TODO: ビジネスロジックを実装
}
