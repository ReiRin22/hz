import { Injectable } from '@nestjs/common';
import { NursingInterventionClient } from './nursing-intervention.client';

@Injectable()
export class NursingInterventionService {
  constructor(private readonly nursingInterventionClient: NursingInterventionClient) {}

  // TODO: ビジネスロジックを実装
}
