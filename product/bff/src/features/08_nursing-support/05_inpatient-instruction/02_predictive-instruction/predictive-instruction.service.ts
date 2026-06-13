import { Injectable } from '@nestjs/common';
import { PredictiveInstructionClient } from './predictive-instruction.client';

@Injectable()
export class PredictiveInstructionService {
  constructor(private readonly predictiveInstructionClient: PredictiveInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
