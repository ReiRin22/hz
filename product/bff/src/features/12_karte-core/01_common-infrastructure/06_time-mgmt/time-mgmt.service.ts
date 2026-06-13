import { Injectable } from '@nestjs/common';
import { TimeMgmtClient } from './time-mgmt.client';

@Injectable()
export class TimeMgmtService {
  constructor(private readonly timeMgmtClient: TimeMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
