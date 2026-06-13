import { Controller } from '@nestjs/common';
import { MwmService } from './mwm.service';

@Controller('mwm')
export class MwmController {
  constructor(private readonly mwmService: MwmService) {}

  // TODO: エンドポイントを実装
}
