import { Controller } from '@nestjs/common';
import { MedicalCategoryStatsService } from './medical-category-stats.service';

@Controller('medical-category-stats')
export class MedicalCategoryStatsController {
  constructor(private readonly medicalCategoryStatsService: MedicalCategoryStatsService) {}

  // TODO: エンドポイントを実装
}
