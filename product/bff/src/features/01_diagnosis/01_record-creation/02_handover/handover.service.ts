import { Injectable } from '@nestjs/common';
import { HandoverClient } from './handover.client';

@Injectable()
export class HandoverService {
  constructor(private readonly handoverClient: HandoverClient) {}

  // TODO: ビジネスロジックを実装
}
