import { Injectable } from '@nestjs/common';
import { DiseaseStatsClient } from './disease-stats.client';

@Injectable()
export class DiseaseStatsService {
  constructor(private readonly diseaseStatsClient: DiseaseStatsClient) {}

  // TODO: ビジネスロジックを実装
}
