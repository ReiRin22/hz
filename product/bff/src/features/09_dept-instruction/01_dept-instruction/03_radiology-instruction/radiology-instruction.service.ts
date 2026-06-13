import { Injectable } from '@nestjs/common';
import { RadiologyInstructionClient } from './radiology-instruction.client';

@Injectable()
export class RadiologyInstructionService {
  constructor(private readonly radiologyInstructionClient: RadiologyInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
