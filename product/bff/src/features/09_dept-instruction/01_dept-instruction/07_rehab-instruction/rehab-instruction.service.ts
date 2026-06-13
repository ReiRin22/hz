import { Injectable } from '@nestjs/common';
import { RehabInstructionClient } from './rehab-instruction.client';

@Injectable()
export class RehabInstructionService {
  constructor(private readonly rehabInstructionClient: RehabInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
