import { Injectable } from '@nestjs/common';
import { PressureSoreMgmtClient } from './pressure-sore-mgmt.client';

@Injectable()
export class PressureSoreMgmtService {
  constructor(private readonly pressureSoreMgmtClient: PressureSoreMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
