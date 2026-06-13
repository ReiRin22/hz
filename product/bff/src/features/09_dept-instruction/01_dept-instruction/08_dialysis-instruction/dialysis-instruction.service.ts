import { Injectable } from '@nestjs/common';
import { DialysisInstructionClient } from './dialysis-instruction.client';

@Injectable()
export class DialysisInstructionService {
  constructor(private readonly dialysisInstructionClient: DialysisInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
