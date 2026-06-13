import { Injectable } from '@nestjs/common';
import { BedPeriodMgmtClient } from './bed-period-mgmt.client';

@Injectable()
export class BedPeriodMgmtService {
  constructor(private readonly bedPeriodMgmtClient: BedPeriodMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
