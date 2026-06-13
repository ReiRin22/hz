import { Controller } from '@nestjs/common';
import { DischargeOutputService } from './discharge-output.service';

@Controller('discharge-output')
export class DischargeOutputController {
  constructor(private readonly dischargeOutputService: DischargeOutputService) {}

  // TODO: エンドポイントを実装
}
