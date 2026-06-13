import { Injectable } from '@nestjs/common';
import { VitalSystemClient } from './vital-system.client';

@Injectable()
export class VitalSystemService {
  constructor(private readonly vitalSystemClient: VitalSystemClient) {}

  // TODO: ビジネスロジックを実装
}
