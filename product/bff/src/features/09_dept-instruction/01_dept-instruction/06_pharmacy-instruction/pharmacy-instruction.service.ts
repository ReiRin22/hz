import { Injectable } from '@nestjs/common';
import { PharmacyInstructionClient } from './pharmacy-instruction.client';

@Injectable()
export class PharmacyInstructionService {
  constructor(private readonly pharmacyInstructionClient: PharmacyInstructionClient) {}

  // TODO: ビジネスロジックを実装
}
