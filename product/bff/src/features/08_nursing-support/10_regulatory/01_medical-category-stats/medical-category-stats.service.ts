import { Injectable } from '@nestjs/common';
import { MedicalCategoryStatsClient } from './medical-category-stats.client';

@Injectable()
export class MedicalCategoryStatsService {
  constructor(private readonly medicalCategoryStatsClient: MedicalCategoryStatsClient) {}

  // TODO: ビジネスロジックを実装
}
