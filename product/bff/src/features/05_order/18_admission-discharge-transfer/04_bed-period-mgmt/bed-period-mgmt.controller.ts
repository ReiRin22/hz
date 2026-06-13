import { Controller } from '@nestjs/common';
import { BedPeriodMgmtService } from './bed-period-mgmt.service';

@Controller('bed-period-mgmt')
export class BedPeriodMgmtController {
  constructor(private readonly bedPeriodMgmtService: BedPeriodMgmtService) {}

  // TODO: エンドポイントを実装
}
