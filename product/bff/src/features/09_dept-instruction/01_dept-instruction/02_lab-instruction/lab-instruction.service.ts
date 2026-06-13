import { Injectable } from '@nestjs/common';
import { LabInstructionClient } from './lab-instruction.client';

@Injectable()
export class LabInstructionService {
  constructor(private readonly labInstructionClient: LabInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
