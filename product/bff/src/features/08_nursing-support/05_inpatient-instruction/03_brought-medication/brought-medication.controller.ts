import { Controller } from '@nestjs/common';
import { BroughtMedicationService } from './brought-medication.service';

@Controller('brought-medication')
export class BroughtMedicationController {
  constructor(private readonly broughtMedicationService: BroughtMedicationService) {}

  // TODO: エンドポイントを実装
}
