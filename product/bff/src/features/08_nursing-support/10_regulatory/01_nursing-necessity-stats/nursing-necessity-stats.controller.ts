import { Controller } from '@nestjs/common';
import { NursingNecessityStatsService } from './nursing-necessity-stats.service';

@Controller('nursing-necessity-stats')
export class NursingNecessityStatsController {
  constructor(private readonly nursingNecessityStatsService: NursingNecessityStatsService) {}

  // TODO: エンドポイントを実装
}
