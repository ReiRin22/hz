import { Controller } from '@nestjs/common';
import { HospitalStatsService } from './hospital-stats.service';

@Controller('hospital-stats')
export class HospitalStatsController {
  constructor(private readonly hospitalStatsService: HospitalStatsService) {}

  // TODO: エンドポイントを実装
}
