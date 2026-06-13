import { Injectable } from '@nestjs/common';
import { PressureSoreObservationClient } from './pressure-sore-observation.client';

@Injectable()
export class PressureSoreObservationService {
  constructor(private readonly pressureSoreObservationClient: PressureSoreObservationClient) {}

  // TODO: ビジネスロジックを実装
}
