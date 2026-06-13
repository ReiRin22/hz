import { Injectable } from '@nestjs/common';
import { HospitalStatsClient } from './hospital-stats.client';

@Injectable()
export class HospitalStatsService {
  constructor(private readonly hospitalStatsClient: HospitalStatsClient) {}

  // TODO: ビジネスロジックを実装
}
