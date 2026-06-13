import { Injectable } from '@nestjs/common';
import { BroughtMedicationClient } from './brought-medication.client';

@Injectable()
export class BroughtMedicationService {
  constructor(private readonly broughtMedicationClient: BroughtMedicationClient) {}

  // TODO: ビジネスロジックを実装
}
