import { Controller } from '@nestjs/common';
import { DiseaseStatsService } from './disease-stats.service';

@Controller('disease-stats')
export class DiseaseStatsController {
  constructor(private readonly diseaseStatsService: DiseaseStatsService) {}

  // TODO: エンドポイントを実装
}
