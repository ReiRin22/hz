import { Controller } from '@nestjs/common';
import { DailyLivingEvalService } from './daily-living-eval.service';

@Controller('daily-living-eval')
export class DailyLivingEvalController {
  constructor(private readonly dailyLivingEvalService: DailyLivingEvalService) {}

  // TODO: エンドポイントを実装
}
