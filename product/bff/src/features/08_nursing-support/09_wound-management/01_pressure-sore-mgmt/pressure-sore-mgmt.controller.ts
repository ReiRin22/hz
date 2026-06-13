import { Controller } from '@nestjs/common';
import { PressureSoreMgmtService } from './pressure-sore-mgmt.service';

@Controller('pressure-sore-mgmt')
export class PressureSoreMgmtController {
  constructor(private readonly pressureSoreMgmtService: PressureSoreMgmtService) {}

  // TODO: エンドポイントを実装
}
