import { Controller } from '@nestjs/common';
import { RadiationDoseService } from './radiation-dose.service';

@Controller('radiation-dose')
export class RadiationDoseController {
  constructor(private readonly radiationDoseService: RadiationDoseService) {}

  // TODO: エンドポイントを実装
}
