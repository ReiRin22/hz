import { Controller } from '@nestjs/common';
import { MedicationSummaryService } from './medication-summary.service';

@Controller('medication-summary')
export class MedicationSummaryController {
  constructor(private readonly medicationSummaryService: MedicationSummaryService) {}

  // TODO: エンドポイントを実装
}
