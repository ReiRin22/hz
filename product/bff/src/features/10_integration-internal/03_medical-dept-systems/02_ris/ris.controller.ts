import { Controller } from '@nestjs/common';
import { RisService } from './ris.service';

@Controller('ris')
export class RisController {
  constructor(private readonly risService: RisService) {}

  // TODO: エンドポイントを実装
}
