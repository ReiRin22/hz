import { Injectable } from '@nestjs/common';
import { RadiationDoseClient } from './radiation-dose.client';

@Injectable()
export class RadiationDoseService {
  constructor(private readonly radiationDoseClient: RadiationDoseClient) {}

  // TODO: ビジネスロジックを実装
}
