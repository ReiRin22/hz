import { Controller } from '@nestjs/common';
import { PressureSoreObservationService } from './pressure-sore-observation.service';

@Controller('pressure-sore-observation')
export class PressureSoreObservationController {
  constructor(private readonly pressureSoreObservationService: PressureSoreObservationService) {}

  // TODO: エンドポイントを実装
}
