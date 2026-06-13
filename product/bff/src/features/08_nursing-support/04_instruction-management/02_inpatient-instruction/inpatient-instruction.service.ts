import { Injectable } from '@nestjs/common';
import { InpatientInstructionClient } from './inpatient-instruction.client';

@Injectable()
export class InpatientInstructionService {
  constructor(private readonly inpatientInstructionClient: InpatientInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
