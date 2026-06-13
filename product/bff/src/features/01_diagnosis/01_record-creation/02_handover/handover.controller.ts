import { Controller } from '@nestjs/common';
import { HandoverService } from './handover.service';

@Controller('handover')
export class HandoverController {
  constructor(private readonly handoverService: HandoverService) {}

  // TODO: エンドポイントを実装
}
