import { Injectable } from '@nestjs/common';
import { NursingNecessityStatsClient } from './nursing-necessity-stats.client';

@Injectable()
export class NursingNecessityStatsService {
  constructor(private readonly nursingNecessityStatsClient: NursingNecessityStatsClient) {}

  // TODO: ビジネスロジックを実装
}
