import { Controller } from '@nestjs/common';
import { TransferOutputService } from './transfer-output.service';

@Controller('transfer-output')
export class TransferOutputController {
  constructor(private readonly transferOutputService: TransferOutputService) {}

  // TODO: エンドポイントを実装
}
