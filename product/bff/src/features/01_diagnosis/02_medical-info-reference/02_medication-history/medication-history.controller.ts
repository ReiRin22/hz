import { Controller } from '@nestjs/common';
import { MedicationHistoryService } from './medication-history.service';

@Controller('medication-history')
export class MedicationHistoryController {
  constructor(private readonly medicationHistoryService: MedicationHistoryService) {}

  // TODO: エンドポイントを実装
}
