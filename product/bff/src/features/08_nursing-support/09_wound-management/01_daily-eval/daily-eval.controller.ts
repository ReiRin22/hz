import { Controller } from '@nestjs/common';
import { DailyEvalService } from './daily-eval.service';

@Controller('daily-eval')
export class DailyEvalController {
  constructor(private readonly dailyEvalService: DailyEvalService) {}

  // TODO: エンドポイントを実装
}
