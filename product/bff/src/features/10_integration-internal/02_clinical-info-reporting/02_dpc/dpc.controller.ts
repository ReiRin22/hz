import { Controller } from '@nestjs/common';
import { DpcService } from './dpc.service';

@Controller('dpc')
export class DpcController {
  constructor(private readonly dpcService: DpcService) {}

  // TODO: エンドポイントを実装
}
