import { Controller } from '@nestjs/common';
import { VitalSystemService } from './vital-system.service';

@Controller('vital-system')
export class VitalSystemController {
  constructor(private readonly vitalSystemService: VitalSystemService) {}

  // TODO: エンドポイントを実装
}
