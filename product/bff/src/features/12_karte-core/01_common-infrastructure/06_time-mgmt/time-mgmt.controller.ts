import { Controller } from '@nestjs/common';
import { TimeMgmtService } from './time-mgmt.service';

@Controller('time-mgmt')
export class TimeMgmtController {
  constructor(private readonly timeMgmtService: TimeMgmtService) {}

  // TODO: エンドポイントを実装
}
