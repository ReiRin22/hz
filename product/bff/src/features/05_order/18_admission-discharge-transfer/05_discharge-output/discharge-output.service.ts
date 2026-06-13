import { Injectable } from '@nestjs/common';
import { DischargeOutputClient } from './discharge-output.client';

@Injectable()
export class DischargeOutputService {
  constructor(private readonly dischargeOutputClient: DischargeOutputClient) {}

  // TODO: ビジネスロジックを実装
}
