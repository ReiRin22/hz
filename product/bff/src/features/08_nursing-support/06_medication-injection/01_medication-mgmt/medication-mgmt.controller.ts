import { Controller } from '@nestjs/common';
import { MedicationMgmtService } from './medication-mgmt.service';

@Controller('medication-mgmt')
export class MedicationMgmtController {
  constructor(private readonly medicationMgmtService: MedicationMgmtService) {}

  // TODO: エンドポイントを実装
}
