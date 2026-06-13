import { Injectable } from '@nestjs/common';
import { SurgeryTransfusionClient } from './surgery-transfusion.client';

@Injectable()
export class SurgeryTransfusionService {
  constructor(private readonly surgeryTransfusionClient: SurgeryTransfusionClient) {}

  // TODO: ビジネスロジックを実装
}
